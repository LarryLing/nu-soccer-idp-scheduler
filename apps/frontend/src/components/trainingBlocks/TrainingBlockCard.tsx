import type { Player, TrainingBlock } from "../../utils/types.ts";
import {
  Badge,
  Box,
  Card,
  Flex,
  Heading,
  IconButton,
  Text,
} from "@radix-ui/themes";
import { Calendar, Clock, PencilIcon, TrashIcon } from "lucide-react";
import { memo, useEffect, useState } from "react";
import {
  collection,
  documentId,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { clientFirestore } from "../../utils/firebase.ts";
import { useUser } from "../../hooks/useUser.ts";
import PlayerCard from "./PlayerCard.tsx";

type TrainingBlockCardProps = {
  handleOpen: (trainingBlock: TrainingBlock) => void;
  trainingBlock: TrainingBlock;
};

export default function TrainingBlockCard({
  handleOpen,
  trainingBlock,
}: TrainingBlockCardProps) {
  const { user } = useUser();

  const [assignedPlayers, setAssignedPlayers] = useState<Player[]>([]);

  useEffect(() => {
    const fetchAssignedPlayers = async () => {
      if (
        !user ||
        !trainingBlock.assignedPlayers ||
        trainingBlock.assignedPlayers.length === 0
      ) {
        return;
      }

      const assignedPlayersQuery = query(
        collection(clientFirestore, `users/${user.uid}/trainingBlocks`),
        where(documentId(), "in", trainingBlock.assignedPlayers),
      );

      try {
        const assignedPlayersSnapshot = await getDocs(assignedPlayersQuery);

        setAssignedPlayers(
          assignedPlayersSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as Player[],
        );
      } catch (error) {
        console.error("Failed to fetch assigned players:", error);
      }
    };

    fetchAssignedPlayers();
  }, [trainingBlock, user]);

  return (
    <Card size="2">
      <Box mb="2">
        <Flex justify="between" align="center" mb="2">
          <Flex align="center" gap="1">
            <Calendar size={15} />
            <Heading size="3">{trainingBlock.day}</Heading>
          </Flex>
          <Flex align="center" gap="4">
            <IconButton
              color="gray"
              variant="ghost"
              onClick={() => handleOpen(trainingBlock)}
            >
              <PencilIcon size={15} />
            </IconButton>
            <IconButton color="red" variant="ghost">
              <TrashIcon size={15} />
            </IconButton>
          </Flex>
        </Flex>
        <Flex justify="between" align="center">
          <Flex align="center" gap="1">
            <Clock size={15} />
            <Text size="2" color="gray">
              {trainingBlock.start} - {trainingBlock.end}
            </Text>
          </Flex>
          <Badge>{trainingBlock.assignedPlayers.length} players</Badge>
        </Flex>
      </Box>
      <Flex
        direction="column"
        justify="start"
        align="center"
        gap="2"
        p="2"
        minHeight="250px"
        overflowY="scroll"
        style={{
          border: "1px dashed var(--gray-6)",
          borderRadius: "12px",
        }}
      >
        {assignedPlayers.length === 0 ? (
          <Text size="2" color="gray">
            Drop players here to assign them
          </Text>
        ) : (
          assignedPlayers.map((player) => (
            <PlayerCard key={player.id} {...player} />
          ))
        )}
      </Flex>
    </Card>
  );
}

export const MemoizedTrainingBlockCard = memo(
  TrainingBlockCard,
  (prevProps: TrainingBlockCardProps, nextProps: TrainingBlockCardProps) => {
    return (
      prevProps.trainingBlock.id === nextProps.trainingBlock.id &&
      prevProps.trainingBlock.day === nextProps.trainingBlock.day &&
      prevProps.trainingBlock.start === nextProps.trainingBlock.start &&
      prevProps.trainingBlock.end === nextProps.trainingBlock.end &&
      JSON.stringify(prevProps.trainingBlock.assignedPlayers) ===
        JSON.stringify(nextProps.trainingBlock.assignedPlayers) &&
      prevProps.handleOpen === nextProps.handleOpen
    );
  },
);
