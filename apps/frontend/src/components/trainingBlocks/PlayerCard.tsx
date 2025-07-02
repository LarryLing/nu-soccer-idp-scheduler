import type { Player } from "../../utils/types.ts";
import {
  Badge,
  Button,
  Flex,
  Heading,
  IconButton,
  Separator,
  Text,
} from "@radix-ui/themes";
import { useState, memo, useCallback } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { CalendarX, XIcon } from "lucide-react";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { clientFirestore } from "../../utils/firebase.ts";
import { useUser } from "../../hooks/useUser.ts";

type PlayerCardProps = {
  assigned?: boolean;
  trainingBlockId?: string;
  isConflictPlayer?: boolean;
} & Player;

export default function PlayerCard({
  id,
  name,
  number,
  position,
  availabilities,
  assigned = false,
  trainingBlockId,
  isConflictPlayer = false,
}: PlayerCardProps) {
  const { user } = useUser();
  const [viewAvailability, setViewAvailability] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: id,
    });

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleUnassignPlayer = useCallback(async () => {
    if (!user || !trainingBlockId) {
      return;
    }

    const trainingBlockDocRef = doc(
      clientFirestore,
      `users/${user.uid}/trainingBlocks/${trainingBlockId}`,
    );

    await updateDoc(trainingBlockDocRef, {
      assignedPlayers: arrayRemove(id),
    });
  }, [user, trainingBlockId, id]);

  const handleToggleAvailability = () => {
    setViewAvailability(!viewAvailability);
  };

  const showUnassignButton = isHovered && !isDragging && assigned;
  const showAvailabilityList = viewAvailability && !isDragging;
  const buttonText =
    viewAvailability && !isDragging
      ? "Hide Availabilities"
      : "Show Availabilities";

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
          {showUnassignButton && (
            <IconButton
              color="red"
              variant="soft"
              size="1"
              onClick={handleUnassignPlayer}
            >
              <XIcon size={15} />
            </IconButton>
          )}
          <PlayerInfo
            name={name}
            position={position}
            number={number}
            isConflictPlayer={isConflictPlayer}
          />
        </Flex>
      </Flex>
      <Separator size="4" />
      <Button
        variant="soft"
        size="1"
        onClick={handleToggleAvailability}
        color="gray"
      >
        {buttonText}
      </Button>
      {showAvailabilityList &&
        availabilities.map((availability, index) => (
          <AvailabilityItem
            key={`${availability.day}.${availability.start}.${availability.end}.${index}`}
            {...availability}
          />
        ))}
    </Flex>
  );
}

const PlayerInfo = memo(
  ({
    name,
    position,
    number,
    isConflictPlayer = false,
  }: {
    name: string;
    position: string;
    number: number;
    isConflictPlayer?: boolean;
  }) => (
    <Flex direction="column" align="start">
      <Heading size="3" color="gray">
        {name}
      </Heading>
      <Text size="2" weight="regular" color="gray">
        {position}
      </Text>
      <Flex
        direction={{
          initial: "column",
          xs: "row",
        }}
        align="center"
        gap="2"
      >
        <Badge size="2" color="gray">
          <Text size="1" weight="bold" color="gray">
            #{number}
          </Text>
        </Badge>
        {isConflictPlayer && (
          <Badge size="2" color="red" variant="solid">
            <CalendarX size={15} />
          </Badge>
        )}
      </Flex>
    </Flex>
  ),
);

const AvailabilityItem = memo(
  ({ day, start, end }: { day: string; start: string; end: string }) => (
    <Flex justify="between" align="center">
      <Text size="1" weight="bold">
        {day}
      </Text>
      <Text size="1">
        {start} - {end}
      </Text>
    </Flex>
  ),
);
