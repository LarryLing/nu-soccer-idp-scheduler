import type { Player, TrainingBlock } from "../../utils/types.ts";
import { Badge, Card, Flex, IconButton, Text } from "@radix-ui/themes";
import { CalendarX, Clock, PencilIcon, TrashIcon, Users } from "lucide-react";
import { deleteDoc, doc } from "firebase/firestore";
import { clientFirestore } from "../../utils/firebase.ts";
import { useUser } from "../../hooks/useUser.ts";
import PlayerCard from "./PlayerCard.tsx";
import { useDroppable } from "@dnd-kit/core";
import { parseTime } from "../../utils/helpers.ts";
import { memo, useCallback, useMemo } from "react";

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

  const conflictPlayerNames = useMemo(
    () =>
      assignedPlayers
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
        .map((assignedPlayer) => assignedPlayer.name),
    [
      assignedPlayers,
      trainingBlock.start,
      trainingBlock.end,
      trainingBlock.day,
    ],
  );

  const handleRemoveTrainingBlock = useCallback(async () => {
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
  }, [user, trainingBlock.id]);

  const handleEdit = useCallback(() => {
    handleOpen(trainingBlock);
  }, [handleOpen, trainingBlock]);

  const cardStyles = useMemo(
    () => ({
      borderColor: isOver ? "var(--purple-6)" : "var(--gray-6)",
      backgroundColor: isOver ? "var(--purple-6)" : "var(--color-panel)",
    }),
    [isOver],
  );

  return (
    <Card ref={setNodeRef} style={cardStyles}>
      <Flex justify="between" align="center" gap="3" mb="3">
        <HeaderBadges
          start={trainingBlock.start}
          end={trainingBlock.end}
          playerCount={trainingBlock.assignedPlayers.length}
          conflictCount={conflictPlayerNames.length}
        />
        <ActionButtons
          onEdit={handleEdit}
          onDelete={handleRemoveTrainingBlock}
        />
      </Flex>
      <PlayerDropZone
        assignedPlayers={assignedPlayers}
        trainingBlockId={trainingBlock.id}
        assignedPlayerIds={trainingBlock.assignedPlayers}
        conflictPlayerNames={conflictPlayerNames}
      />
    </Card>
  );
}

const HeaderBadges = memo(
  ({
    start,
    end,
    playerCount,
    conflictCount,
  }: {
    start: string;
    end: string;
    playerCount: number;
    conflictCount: number;
  }) => (
    <Flex
      direction={{
        initial: "column",
        xs: "row",
      }}
      align={{
        initial: "start",
        xs: "center",
      }}
      gap="3"
      wrap="wrap"
    >
      <Flex align="center" gap="1">
        <Clock size={15} />
        <Text size="2" color="gray" weight="bold">
          {start} - {end}
        </Text>
      </Flex>
      <Badge size="2" color="gray">
        <Users size={15} />
        {playerCount} players
      </Badge>
      {conflictCount > 0 && (
        <Badge size="2" color="red" variant="solid">
          <CalendarX size={15} />
          {conflictCount} conflicts
        </Badge>
      )}
    </Flex>
  ),
);

const ActionButtons = memo(
  ({ onEdit, onDelete }: { onEdit: () => void; onDelete: () => void }) => (
    <Flex align="center" gap="5" mr="2">
      <IconButton color="gray" variant="ghost" size="3" onClick={onEdit}>
        <PencilIcon size={15} />
      </IconButton>
      <IconButton color="red" variant="ghost" size="3" onClick={onDelete}>
        <TrashIcon size={15} />
      </IconButton>
    </Flex>
  ),
);

const PlayerDropZone = ({
  assignedPlayers,
  trainingBlockId,
  conflictPlayerNames,
}: {
  assignedPlayers: Player[];
  trainingBlockId: string;
  assignedPlayerIds: string[];
  conflictPlayerNames: string[];
}) => (
  <Flex
    direction="column"
    justify="start"
    align="center"
    gap="2"
    p="2"
    maxHeight="450px"
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
      assignedPlayers.map((assignedPlayer) => {
        const isConflictPlayer =
          conflictPlayerNames &&
          conflictPlayerNames.includes(assignedPlayer.name);

        return (
          <PlayerCard
            key={assignedPlayer.id}
            {...assignedPlayer}
            trainingBlockId={trainingBlockId}
            isConflictPlayer={isConflictPlayer}
            assigned
          />
        );
      })
    )}
  </Flex>
);
