import { Box, Flex, Heading, Section, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import type {
  ContainerItem,
  Player,
  TrainingBlock,
} from "../../utils/types.ts";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { clientFirestore } from "../../utils/firebase.ts";
import { useUser } from "../../hooks/useUser.ts";
import { AvailablePlayersList } from "../../components/trainingBlocks/AvailablePlayersList.tsx";
import TrainingBlocksGridActionRow from "../../components/trainingBlocks/TrainingBlockGridActionRow.tsx";
import TrainingBlocksGrid from "../../components/trainingBlocks/TrainingBlocksGrid.tsx";
import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";

export default function TrainingBlocks() {
  const { user } = useUser();

  const [activePlayer, setActivePlayer] = useState<Player | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [trainingBlocks, setTrainingBlocks] = useState<TrainingBlock[]>([]);
  const [containers, setContainers] = useState<ContainerItem[]>([]);

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
    if (players.length === 0 || trainingBlocks.length === 0) {
      return;
    }

    const containerItems: ContainerItem[] = [];

    const assignedPlayerIds = new Set();
    trainingBlocks.forEach((trainingBlock) => {
      trainingBlock.assignedPlayers.forEach((assignedPlayer) =>
        assignedPlayerIds.add(assignedPlayer.id),
      );
    });

    const availablePlayers = players.filter(
      (player) => !assignedPlayerIds.has(player.id),
    );

    containerItems.push({
      type: "available",
      id: "availablePlayers",
      assignedPlayers: availablePlayers,
    });

    trainingBlocks.forEach((trainingBlock) => {
      containerItems.push({
        ...trainingBlock,
        type: "training-block",
      });
    });

    setContainers(containerItems);
  }, [players, trainingBlocks]);

  const handleDragStart = (event: DragStartEvent) => {
    setActivePlayer(
      players.find((player) => player.id === event.active.id) || null,
    );
  };

  const findContainerId = (id: string) => {
    if (containers.some((container) => container.id === id)) {
      return id;
    }

    return containers.find((container) =>
      container.assignedPlayers.some(
        (assignedPlayer) => assignedPlayer.id === id,
      ),
    )?.id;
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
        console.log("returning activeContainer check");
        return prev;
      }

      const activeItem = activeContainer.assignedPlayers.find(
        (assignedPlayer) => assignedPlayer.id === activePlayer.id,
      );

      if (!activeItem) {
        console.log("returning activeItem check");

        return prev;
      }

      return prev.map((container) => {
        if (container.id === activeContainerId) {
          return {
            ...container,
            assignedPlayers: container.assignedPlayers.filter(
              (assignedPlayer) => assignedPlayer.id !== activePlayer.id,
            ),
          };
        } else if (container.id === overContainerId) {
          return {
            ...container,
            assignedPlayers: [...container.assignedPlayers, activePlayer],
          };
        }
        return container;
      });
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over) {
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
      setContainers((prev) => {
        return prev.map((container) => {
          if (container.id === activeContainerId) {
            return {
              ...container,
              assignedPlayers: container.assignedPlayers.sort(
                (a, b) => a.number - b.number,
              ),
            };
          }

          return container;
        });
      });
    }
  };

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
          collisionDetection={closestCenter}
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
                availablePlayers={
                  containers.find((container) => container.type === "available")
                    ?.assignedPlayers || []
                }
              />
            </Box>
            <Box flexBasis="75%">
              <TrainingBlocksGridActionRow trainingBlocks={trainingBlocks} />
              <TrainingBlocksGrid
                trainingBlockContainers={containers.filter(
                  (container) => container.type !== "available",
                )}
              />
            </Box>
          </Flex>
        </DndContext>
      </Section>
    </>
  );
}
