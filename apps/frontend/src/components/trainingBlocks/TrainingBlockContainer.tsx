import type { Player, TrainingBlock } from "../../utils/types.ts";
import { Badge, Card, Flex, IconButton, Text } from "@radix-ui/themes";
import { Clock, PencilIcon, TrashIcon, Users } from "lucide-react";
import { deleteDoc, doc } from "firebase/firestore";
import { clientFirestore } from "../../utils/firebase.ts";
import { useUser } from "../../hooks/useUser.ts";
import PlayerCard from "./PlayerCard.tsx";
import { useDroppable } from "@dnd-kit/core";
import { parseTime } from "../../utils/helpers.ts";
import { ConflictHoverCard } from "./ConflictHoverCard.tsx";

type TrainingBlockContainerProps = {
  handleOpen: (trainingBlock: TrainingBlock) => void;
  trainingBlock: TrainingBlock;
  assignedPlayers: Player[];
};

export default function TrainingBlockContainer({
  handleOpen,
  trainingBlock,
  assignedPlayers,
}: TrainingBlockContainerProps) {
  const { user } = useUser();

  const { isOver, setNodeRef } = useDroppable({
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
    <Card
      size="2"
      ref={setNodeRef}
      style={{
        borderColor: isOver ? "var(--purple-6)" : "var(--gray-6)",
        backgroundColor: isOver ? "var(--purple-6)" : "var(--color-panel)",
      }}
    >
      <Flex justify="between" align="center" mb="3">
        <Flex align="center" gap="4">
          <Flex align="center" gap="1">
            <Clock size={15} />
            <Text size="2" color="gray" weight="bold">
              {trainingBlock.start} - {trainingBlock.end}
            </Text>
          </Flex>
          <Badge size="2" color="gray">
            <Users size={15} />
            {trainingBlock.assignedPlayers.length} players
          </Badge>
          {conflictPlayerNames.length > 0 && (
            <ConflictHoverCard conflictPlayerNames={conflictPlayerNames} />
          )}
        </Flex>
        <Flex align="center" gap="4">
          <IconButton
            color="gray"
            variant="ghost"
            size="3"
            onClick={() => handleOpen(trainingBlock)}
          >
            <PencilIcon size={15} />
          </IconButton>
          <IconButton
            color="red"
            variant="ghost"
            size="3"
            onClick={handleRemoveTrainingBlock}
          >
            <TrashIcon size={15} />
          </IconButton>
        </Flex>
      </Flex>
      <Flex
        direction="column"
        justify="start"
        align="center"
        gap="2"
        p="2"
        overflowY="scroll"
        style={{
          border: "1px dashed var(--gray-6)",
          borderRadius: "12px",
        }}
      >
        {assignedPlayers.length === 0 ? (
          <Text size="1" color="gray">
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
