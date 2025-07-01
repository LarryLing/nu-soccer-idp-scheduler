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
import { deleteDoc, doc } from "firebase/firestore";
import { clientFirestore } from "../../utils/firebase.ts";
import { useUser } from "../../hooks/useUser.ts";
import PlayerCard from "./PlayerCard.tsx";
import { useDroppable } from "@dnd-kit/core";
import { parseTime } from "../../utils/helpers.ts";
import { ConflictHoverCard } from "./ConflictHoverCard.tsx";

type TrainingBlockCardProps = {
  handleOpen: (trainingBlock: TrainingBlock) => void;
  trainingBlock: TrainingBlock;
  assignedPlayers: Player[];
};

export default function TrainingBlockCard({
  handleOpen,
  trainingBlock,
  assignedPlayers,
}: TrainingBlockCardProps) {
  const { user } = useUser();

  const { setNodeRef } = useDroppable({
    id: trainingBlock.id,
  });

  const handleRemoveTrainingBlock = async () => {
    if (!user) {
      throw new Error("User not authenticated");
    }

    try {
      await deleteDoc(
        doc(
          clientFirestore,
          `users/${user.uid!}/trainingBlocks/${trainingBlock.id}`,
        ),
      );
    } catch (error) {
      console.error("Failed to delete training block:", error);
    }
  };

  const conflictPlayerNames = assignedPlayers
    .filter((assignedPlayer) => {
      if (assignedPlayer.availabilities.length === 0) {
        return false;
      }

      return !assignedPlayer.availabilities.some(
        (availability) =>
          parseTime(trainingBlock.start) >= parseTime(availability.start) &&
          parseTime(trainingBlock.end) <= parseTime(availability.end) &&
          trainingBlock.day === availability.day,
      );
    })
    .map((assignedPlayer) => assignedPlayer.name);

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
            <IconButton
              color="red"
              variant="ghost"
              onClick={handleRemoveTrainingBlock}
            >
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
          <Flex align="center" gap="1">
            {conflictPlayerNames.length > 0 && (
              <ConflictHoverCard conflictPlayerNames={conflictPlayerNames} />
            )}
            <Badge>{trainingBlock.assignedPlayers.length} players</Badge>
          </Flex>
        </Flex>
      </Box>
      <Flex
        ref={setNodeRef}
        direction="column"
        justify="start"
        align="center"
        gap="2"
        p="2"
        minHeight="350px"
        maxHeight="450px"
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
          assignedPlayers.map((assignedPlayer) => (
            <PlayerCard
              key={assignedPlayer.id}
              {...assignedPlayer}
              trainingBlockId={trainingBlock.id}
              assignedPlayerIds={trainingBlock.assignedPlayers}
              assigned
            />
          ))
        )}
      </Flex>
    </Card>
  );
}
