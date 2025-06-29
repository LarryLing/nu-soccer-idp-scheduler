import { Box, Flex, Heading, Section, Text } from "@radix-ui/themes";
import { useEffect, useState } from "react";
import type { Player, TrainingBlock } from "../../utils/types.ts";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { clientFirestore } from "../../utils/firebase.ts";
import { useUser } from "../../hooks/useUser.ts";
import { AvailablePlayersList } from "../../components/trainingBlocks/AvailablePlayersList.tsx";
import TrainingBlocksGridActionRow from "../../components/trainingBlocks/TrainingBlockGridActionRow.tsx";
import TrainingBlocksGrid from "../../components/trainingBlocks/TrainingBlocksGrid.tsx";

export default function TrainingBlocks() {
  const { user } = useUser();

  const [players, setPlayers] = useState<Player[]>([]);
  const [trainingBlocks, setTrainingBlocks] = useState<TrainingBlock[]>([]);
  const [availablePlayers, setAvailablePlayers] = useState<Player[]>([]);

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
    if (players.length === 0 && trainingBlocks.length === 0) {
      return;
    }

    const assignedPlayerIds = new Set();
    trainingBlocks.forEach((block) => {
      if (block.assignedPlayers.length > 0) {
        block.assignedPlayers.forEach((playerId) => {
          assignedPlayerIds.add(playerId);
        });
      }
    });

    const available = players.filter(
      (player) => !assignedPlayerIds.has(player.id),
    );

    setAvailablePlayers(available);
  }, [players, trainingBlocks]);

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
            <AvailablePlayersList players={availablePlayers} />
          </Box>
          <Box flexBasis="75%">
            <TrainingBlocksGridActionRow trainingBlocks={trainingBlocks} />
            <TrainingBlocksGrid trainingBlocks={trainingBlocks} />
          </Box>
        </Flex>
      </Section>
    </>
  );
}
