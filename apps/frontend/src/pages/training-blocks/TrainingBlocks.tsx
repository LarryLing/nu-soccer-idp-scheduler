import { Box, Flex, Heading, Section, Text } from "@radix-ui/themes";
import { useEffect, useMemo, useState } from "react";
import type {
  ContainerItem,
  Player,
  TrainingBlock,
} from "../../utils/types.ts";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  writeBatch,
} from "firebase/firestore";
import { clientFirestore } from "../../utils/firebase.ts";
import { useUser } from "../../hooks/useUser.ts";
import { AvailablePlayersList } from "../../components/trainingBlocks/AvailablePlayersList.tsx";
import TrainingBlocksGridActionRow from "../../components/trainingBlocks/TrainingBlockGridActionRow.tsx";
import TrainingBlocksGrid from "../../components/trainingBlocks/TrainingBlocksGrid.tsx";
import {
  pointerWithin,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  DragOverlay,
  useSensor,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import PlayerCardOverlay from "../../components/trainingBlocks/PlayerCardOverlay.tsx";

export default function TrainingBlocks() {
  const { user } = useUser();

  const [activePlayer, setActivePlayer] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [trainingBlocks, setTrainingBlocks] = useState<TrainingBlock[]>([]);
  const [containers, setContainers] = useState<ContainerItem[]>([]);

  const assignedPlayerIds = useMemo(() => {
    const ids = new Set<string>();
    trainingBlocks.forEach((block) => {
      block.assignedPlayers.forEach((playerId) => ids.add(playerId));
    });
    return ids;
  }, [trainingBlocks]);

  const availablePlayerIds = useMemo(() => {
    return players
      .filter((player) => !assignedPlayerIds.has(player.id))
      .map((player) => player.id);
  }, [players, assignedPlayerIds]);

  useEffect(() => {
    if (!user) {
      return;
    }

    const playersQuery = query(
      collection(clientFirestore, `users/${user.uid}/players`),
      orderBy("number", "asc"),
    );

    const playersUnsubscribe = onSnapshot(playersQuery, (snapshot) => {
      setPlayers(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Player[],
      );
    });

    const trainingBlocksQuery = query(
      collection(clientFirestore, `users/${user.uid}/trainingBlocks`),
    );

    const trainingBlocksUnsubscribe = onSnapshot(
      trainingBlocksQuery,
      (snapshot) => {
        setTrainingBlocks(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as TrainingBlock[],
        );
      },
    );

    return () => {
      playersUnsubscribe();
      trainingBlocksUnsubscribe();
    };
  }, [user]);

  useEffect(() => {
    setContainers([
      {
        type: "available",
        id: "availablePlayers",
        assignedPlayers: availablePlayerIds,
      },
      ...trainingBlocks.map((block) => ({
        ...block,
        type: "training-block" as const,
      })),
    ]);
  }, [availablePlayerIds, players, trainingBlocks]);

  const trainingBlockContainers = containers.filter(
    (container) => container.type !== "available",
  );

  const findContainerId = (id: string) => {
    if (containers.some((container) => container.id === id)) {
      return id;
    }

    return containers.find((container) =>
      container.assignedPlayers.some(
        (assignedPlayerId) => assignedPlayerId === id,
      ),
    )?.id;
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActivePlayer(
      players.find((player) => player.id === event.active.id) || null,
    );
  };

  const handleDragOver = async (event: DragOverEvent) => {
    if (!user) {
      return;
    }

    if (!activePlayer) {
      return;
    }

    const { over } = event;

    if (!over) {
      return;
    }

    const activeContainerId = findContainerId(activePlayer.id);
    const overContainerId = findContainerId(over.id.toString());

    if (
      !activeContainerId ||
      !overContainerId ||
      activeContainerId === overContainerId
    ) {
      return;
    }

    setContainers((prev) => {
      const activeContainer = prev.find(
        (container) => container.id === activeContainerId,
      );

      if (!activeContainer) {
        return prev;
      }

      const activeItem = activeContainer.assignedPlayers.find(
        (assignedPlayerId) => assignedPlayerId === activePlayer.id,
      );

      if (!activeItem) {
        return prev;
      }

      return prev.map((container) => {
        if (container.id === activeContainerId) {
          return {
            ...container,
            assignedPlayers: container.assignedPlayers.filter(
              (assignedPlayerId) => assignedPlayerId !== activePlayer.id,
            ),
          };
        } else if (container.id === overContainerId) {
          return {
            ...container,
            assignedPlayers: [...container.assignedPlayers, activePlayer.id],
          };
        }
        return container;
      });
    });
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || !user) {
      setActivePlayer(null);
      return;
    }

    const activeContainerId = findContainerId(active.id.toString());
    const overContainerId = findContainerId(over.id.toString());

    if (!activeContainerId || !overContainerId) {
      setActivePlayer(null);
      return;
    }

    if (activeContainerId === overContainerId && active.id !== over.id) {
      try {
        const batch = writeBatch(clientFirestore);

        containers.forEach((container) => {
          if (container.type === "available") {
            return;
          }

          const trainingBlockRef = doc(
            clientFirestore,
            `users/${user.uid}/trainingBlocks/${container.id}`,
          );

          batch.update(trainingBlockRef, {
            assignedPlayers: container.assignedPlayers,
          });
        });

        await batch.commit();
      } catch (error) {
        console.error("Failed to update assigned players:", error);
      }
    }
  };

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      delay: 175,
      tolerance: 5,
      distance: 10,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 175,
      tolerance: 5,
      distance: 10,
    },
  });

  return (
    <>
      <Section p="0">
        <Heading size="9" mb="3">
          Edit Training Blocks
        </Heading>
        <Text size="3" weight="medium">
          Assign and move players between training blocks.
        </Text>
      </Section>
      <Section p="0">
        <DndContext
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
          collisionDetection={pointerWithin}
          sensors={[mouseSensor, touchSensor]}
        >
          <Flex
            direction={{
              initial: "column",
              sm: "row",
            }}
            gap="4"
          >
            <Box
              flexBasis="25%"
              minWidth={{
                initial: "256px",
                xs: "275px",
              }}
            >
              <AvailablePlayersList
                players={players}
                availablePlayerIds={availablePlayerIds}
              />
            </Box>
            <Box flexBasis="75%">
              <TrainingBlocksGridActionRow trainingBlocks={trainingBlocks} />
              <TrainingBlocksGrid
                players={players}
                trainingBlockContainers={trainingBlockContainers}
              />
            </Box>
          </Flex>
          <DragOverlay>
            {activePlayer && <PlayerCardOverlay {...activePlayer} />}
          </DragOverlay>
        </DndContext>
      </Section>
    </>
  );
}
