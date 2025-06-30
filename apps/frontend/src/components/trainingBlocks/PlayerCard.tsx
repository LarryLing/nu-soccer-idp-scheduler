import type { Player } from "../../utils/types.ts";
import { Button, Flex, Heading, Separator, Text } from "@radix-ui/themes";
import { useState } from "react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

export default function PlayerCard({
  id,
  name,
  number,
  position,
  availabilities,
}: Player) {
  const [viewAvailability, setViewAvailability] = useState(false);

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
  };

  return (
    <Flex
      ref={setNodeRef}
      direction="column"
      gap="2"
      p="2"
      width="100%"
      style={{
        ...style,
        border: "1px solid var(--gray-6)",
        borderRadius: "12px",
        backgroundColor: "var(--color-panel)",
      }}
      {...listeners}
      {...attributes}
    >
      <Flex justify="between" align="center">
        <Flex direction="column" align="start">
          <Heading size="3" color="gray">
            {name}
          </Heading>
          <Text size="2" weight="regular" color="gray">
            {position}
          </Text>
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
        {viewAvailability ? "Hide Availabilities" : "Show Availabilities"}
      </Button>
      {viewAvailability &&
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
