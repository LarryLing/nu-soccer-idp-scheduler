import type { Player } from "../../utils/types.ts";
import {
  Button,
  Flex,
  Heading,
  IconButton,
  Separator,
  Text,
} from "@radix-ui/themes";
import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { XIcon } from "lucide-react";
import { doc, updateDoc } from "firebase/firestore";
import { clientFirestore } from "../../utils/firebase.ts";
import { useUser } from "../../hooks/useUser.ts";

type PlayerCardProps = {
  assigned?: boolean;
  trainingBlockId?: string;
  assignedPlayerIds?: Player["id"][];
} & Player;

export default function PlayerCard({
  id,
  name,
  number,
  position,
  availabilities,
  assigned = false,
  trainingBlockId,
  assignedPlayerIds,
}: PlayerCardProps) {
  const { user } = useUser();

  const [viewAvailability, setViewAvailability] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: id,
    });

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleUnassignPlayer = async () => {
    if (!user || !trainingBlockId || !assignedPlayerIds) {
      return;
    }

    const trainingBlockDocRef = doc(
      clientFirestore,
      `users/${user.uid}/trainingBlocks/${trainingBlockId}`,
    );

    await updateDoc(trainingBlockDocRef, {
      assignedPlayers: assignedPlayerIds.filter((assignedPlayerId) => {
        return assignedPlayerId !== id;
      }),
    });
  };

  return (
    <Flex
      ref={setNodeRef}
      direction="column"
      gap="2"
      p="2"
      width="100%"
      style={{
        transform: isDragging ? undefined : CSS.Translate.toString(transform),
        opacity: isDragging ? 0.5 : 1,
        border: "1px solid var(--gray-6)",
        borderRadius: "12px",
        backgroundColor: "var(--color-panel)",
      }}
      {...listeners}
      {...attributes}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Flex justify="between" align="center">
        <Flex align="center" gap="2">
          {isHovered && !isDragging && assigned && (
            <IconButton
              color="red"
              variant="soft"
              size="1"
              onClick={handleUnassignPlayer}
            >
              <XIcon size={15} />
            </IconButton>
          )}
          <Flex direction="column" align="start">
            <Heading size="3" color="gray">
              {name}
            </Heading>
            <Text size="2" weight="regular" color="gray">
              {position}
            </Text>
          </Flex>
        </Flex>
        <Text weight="bold" color="gray">
          #{number}
        </Text>
      </Flex>
      <Separator size="4" />
      <Button
        variant="soft"
        size="1"
        onClick={() => setViewAvailability(!viewAvailability)}
        color="gray"
      >
        {viewAvailability && !isDragging
          ? "Hide Availabilities"
          : "Show Availabilities"}
      </Button>
      {viewAvailability &&
        !isDragging &&
        availabilities.map((availability, index) => (
          <Flex
            key={`${availability.day}.${availability.start}.${availability.end}.${index}`}
            justify="between"
            align="center"
          >
            <Text size="1" weight="bold">
              {availability.day}
            </Text>
            <Text size="1">
              {availability.start} - {availability.end}
            </Text>
          </Flex>
        ))}
    </Flex>
  );
}
