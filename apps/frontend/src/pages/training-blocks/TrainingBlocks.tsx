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
import TrainingBlocksContainersListActionRow from "../../components/trainingBlocks/TrainingBlockContainersListActionRow.tsx";
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
import TrainingBlockContainersList from "../../components/trainingBlocks/TrainingBlockContainersList.tsx";

export default function TrainingBlocks() {
  const { user } = useUser();

  const [activePlayer, setActivePlayer] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [trainingBlocks, setTrainingBlocks] = useState<TrainingBlock[]>([]);
  const [containers, setContainers] = useState<ContainerItem[]>([]);
  const [originalContainerId, setOriginalContainerId] = useState<string | null>(
    null,
  );
  const [dayFilter, setDayFilter] = useState("All");

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
      orderBy("createdAt", "asc"),
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

  const trainingBlockContainers = containers
    .filter((container) => container.type !== "available")
    .filter((container) => {
      return dayFilter === "All" || container.day === dayFilter;
    });

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
    const player =
      players.find((player) => player.id === event.active.id) || null;
    setActivePlayer(player);

    if (player) {
      setOriginalContainerId(findContainerId(player.id) || null);
    }
  };

  const handleDragOver = async (event: DragOverEvent) => {
    const { over } = event;

    if (!user || !activePlayer || !over) {
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
    const { over } = event;

    if (!over || !user || !activePlayer) {
      setActivePlayer(null);
      setOriginalContainerId(null);
      return;
    }

    const finalContainerId = findContainerId(over.id.toString());

    if (originalContainerId !== finalContainerId && finalContainerId) {
      try {
        const batch = writeBatch(clientFirestore);

        const containersToUpdate = containers.filter(
          (container) => container.type !== "available",
        );

        const changedContainers = containersToUpdate.filter((container) => {
          const originalBlock = trainingBlocks.find(
            (block) => block.id === container.id,
          );
          if (!originalBlock) return false;

          const currentPlayers = container.assignedPlayers.sort();
          const originalPlayers = originalBlock.assignedPlayers.sort();

          return (
            JSON.stringify(currentPlayers) !== JSON.stringify(originalPlayers)
          );
        });

        changedContainers.forEach((container) => {
          const trainingBlockRef = doc(
            clientFirestore,
            `users/${user.uid}/trainingBlocks/${container.id}`,
          );

          batch.update(trainingBlockRef, {
            assignedPlayers: container.assignedPlayers,
          });
        });

        if (changedContainers.length > 0) {
          await batch.commit();
        }
      } catch (error) {
        console.error("Failed to update assigned players:", error);

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
      }
    }

    setActivePlayer(null);
    setOriginalContainerId(null);
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
              <TrainingBlocksContainersListActionRow
                trainingBlocks={trainingBlocks}
                dayFilter={dayFilter}
                setDayFilter={setDayFilter}
              />
              <TrainingBlockContainersList
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
