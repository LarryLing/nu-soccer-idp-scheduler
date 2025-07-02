import type { Availability, Player, TrainingBlock } from "../../utils/types.ts";
import {
  Badge,
  Button,
  Flex,
  Heading,
  IconButton,
  Text,
} from "@radix-ui/themes";
import { useState, memo, useCallback } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { CalendarX, XIcon } from "lucide-react";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { clientFirestore } from "../../utils/firebase.ts";
import { useUser } from "../../hooks/useUser.ts";
import { parseTime } from "../../utils/helpers.ts";
import { DAYS } from "../../utils/constants.ts";
import "../../styles/playercard.css";

type PlayerCardProps = {
  assigned?: boolean;
  trainingBlock?: TrainingBlock;
  conflictDay?: Availability["day"];
} & Player;

export default function PlayerCard({
  id,
  name,
  number,
  position,
  availabilities,
  assigned = false,
  trainingBlock,
  conflictDay,
}: PlayerCardProps) {
  const { user } = useUser();
  const [viewAvailability, setViewAvailability] = useState(false);

  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: id,
    });

  const handleUnassignPlayer = useCallback(async () => {
    if (!user || !trainingBlock) {
      return;
    }

    const trainingBlockDocRef = doc(
      clientFirestore,
      `users/${user.uid}/trainingBlocks/${trainingBlock.id}`,
    );

    await updateDoc(trainingBlockDocRef, {
      assignedPlayers: arrayRemove(id),
    });
  }, [user, trainingBlock, id]);

  const handleToggleAvailability = () => {
    setViewAvailability(!viewAvailability);
  };

  const showUnassignButton = assigned && !isDragging;
  const showAvailabilityList = viewAvailability && !isDragging;
  const buttonText =
    viewAvailability && !isDragging
      ? "Hide Availabilities"
      : "Show Availabilities";

  return (
    <Flex
      ref={setNodeRef}
      className="player-card"
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
    >
      <PlayerInfo
        name={name}
        position={position}
        number={number}
        conflictDay={conflictDay}
        showUnassignButton={showUnassignButton}
        handleUnassignPlayer={handleUnassignPlayer}
      />
      <Button
        variant="outline"
        size="1"
        onClick={handleToggleAvailability}
        color="gray"
      >
        {buttonText}
      </Button>
      {showAvailabilityList &&
        DAYS.map((day) => {
          const filteredAvailabilities = availabilities.filter(
            (availability) => availability.day === day,
          );

          if (filteredAvailabilities.length === 0) return null;

          return (
            <DayAvailability
              key={day}
              day={day}
              availabilities={filteredAvailabilities}
              conflictDay={conflictDay}
            />
          );
        })}
    </Flex>
  );
}

const PlayerInfo = memo(
  ({
    name,
    position,
    number,
    conflictDay,
    showUnassignButton,
    handleUnassignPlayer,
  }: {
    name: string;
    position: string;
    number: number;
    conflictDay?: Availability["day"];
    showUnassignButton: boolean;
    handleUnassignPlayer: () => void;
  }) => (
    <Flex justify="between" align="center">
      <Flex align="center" gap="2">
        <span className="unassign-btn-wrapper">
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
        </span>
        <Flex direction="column">
          <Heading size="3" color="gray">
            {name}
          </Heading>
          <Text size="2" weight="regular" color="gray">
            {position}
          </Text>
        </Flex>
      </Flex>
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
        {conflictDay && (
          <Badge size="2" color="red" variant="solid">
            <CalendarX size={15} />
          </Badge>
        )}
      </Flex>
    </Flex>
  ),
);

const DayAvailability = ({
  day,
  availabilities,
  conflictDay,
}: {
  day: string;
  availabilities: Availability[];
  conflictDay?: Availability["day"];
}) => {
  const sortedAvailabilities = availabilities.sort(
    (a, b) => parseTime(a.start) - parseTime(b.start),
  );
  return (
    <Flex
      justify="between"
      align="start"
      p="2"
      style={{
        backgroundColor: conflictDay === day ? "var(--red-4)" : "var(--gray-2)",
        borderRadius: "4px",
      }}
    >
      <Text size="1" weight="bold">
        {day}
      </Text>
      <Flex direction="column">
        {sortedAvailabilities.map((availability, index) => (
          <Text
            key={`${availability.day}.${availability.start}.${availability.end}.${index}`}
            size="1"
          >
            {availability.start} - {availability.end}
          </Text>
        ))}
      </Flex>
    </Flex>
  );
};
