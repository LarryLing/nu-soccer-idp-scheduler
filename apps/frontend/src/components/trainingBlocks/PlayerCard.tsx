import type { Player } from "../../utils/types.ts";
import { Button, Flex, Heading, Separator, Text } from "@radix-ui/themes";
import { useState } from "react";

export default function PlayerCard({
  name,
  number,
  position,
  availabilities,
}: Player) {
  const [viewAvailability, setViewAvailability] = useState(false);

  return (
    <Flex
      direction="column"
      gap="2"
      p="2"
      width="100%"
      style={{
        border: "1px solid var(--gray-6)",
        borderRadius: "12px",
        backgroundColor: "var(--color-panel)",
      }}
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
        availabilities.map((availability) => (
          <Flex justify="between" align="center">
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
