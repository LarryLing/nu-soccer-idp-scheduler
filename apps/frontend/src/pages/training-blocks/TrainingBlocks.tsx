import { Box, Flex, Heading, Section, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
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
import { snapCenterToCursor } from "@dnd-kit/modifiers";

export default function TrainingBlocks() {
  const { user } = useUser();

  const [players, setPlayers] = useState<Player[]>([]);
  const [trainingBlocks, setTrainingBlocks] = useState<TrainingBlock[]>([]);
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);
  const [originalContainerId, setOriginalContainerId] = useState<string | null>(
    null,
  );
  const [dayFilter, setDayFilter] = useState("All");
  const [containers, setContainers] = useState<ContainerItem[]>([]);

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

  const availablePlayerIds = players
    .filter(
      (player) =>
        !trainingBlocks.some((block) =>
          block.assignedPlayers.includes(player.id),
        ),
    )
    .map((player) => player.id);

  const findContainerId = (playerId: string): string | undefined => {
    if (containers.some((container) => container.id === playerId)) {
      return playerId;
    }
    return containers.find((container) =>
      container.assignedPlayers.some(
        (assignedPlayerId) => assignedPlayerId === playerId,
      ),
    )?.id;
  };

  const getChangedContainers = (): ContainerItem[] => {
    const containersToUpdate = containers.filter(
      (container) => container.type !== "available",
    );

    return containersToUpdate.filter((container) => {
      const originalBlock = trainingBlocks.find(
        (block) => block.id === container.id,
      );
      if (!originalBlock) return false;

      const currentPlayers = container.assignedPlayers.sort();
      const originalPlayers = originalBlock.assignedPlayers.sort();

      return JSON.stringify(currentPlayers) !== JSON.stringify(originalPlayers);
    });
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const player = players.find((player) => player.id === active.id) || null;
    setActivePlayerId(player?.id || null);

    if (player) {
      setOriginalContainerId(findContainerId(player.id) || null);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!user || !over) return;

    const activeContainerId = findContainerId(active.id.toString());
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
      if (!activeContainer) return prev;

      const activeItem = activeContainer.assignedPlayers.find(
        (assignedPlayerId) => assignedPlayerId === activePlayer?.id,
      );
      if (!activeItem || !activePlayer) return prev;

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

    if (!over || !user) {
      setActivePlayerId(null);
      setOriginalContainerId(null);
      return;
    }

    const finalContainerId = findContainerId(over.id.toString());

    if (originalContainerId !== finalContainerId && finalContainerId) {
      try {
        const changedContainers = getChangedContainers();

        if (changedContainers.length > 0) {
          const batch = writeBatch(clientFirestore);

          changedContainers.forEach((container) => {
            const trainingBlockRef = doc(
              clientFirestore,
              `users/${user!.uid}/trainingBlocks/${container.id}`,
            );

            batch.update(trainingBlockRef, {
              assignedPlayers: container.assignedPlayers,
            });
          });

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

    setActivePlayerId(null);
    setOriginalContainerId(null);
  };

  const activePlayer =
    players.find((player) => player.id === activePlayerId) || null;

  const trainingBlockContainers = containers
    .filter((container) => container.type !== "available")
    .filter((container) => dayFilter === "All" || container.day === dayFilter);

  useEffect(() => {
    if (!user) return;

    const playersQuery = query(
      collection(clientFirestore, `users/${user.uid}/players`),
      orderBy("number", "asc"),
    );

    const trainingBlocksQuery = query(
      collection(clientFirestore, `users/${user.uid}/trainingBlocks`),
      orderBy("createdAt", "asc"),
    );

    const playersUnsubscribe = onSnapshot(playersQuery, (snapshot) => {
      setPlayers(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Player[],
      );
    });

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
  }, [trainingBlocks]);

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
          <DragOverlay modifiers={[snapCenterToCursor]}>
            {activePlayer && <PlayerCardOverlay {...activePlayer} />}
          </DragOverlay>
        </DndContext>
      </Section>
    </>
  );
}
