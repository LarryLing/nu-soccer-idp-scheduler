import type { Player } from "../../utils/types.ts";
import { Badge, Button, Flex, Heading, Separator, Text } from "@radix-ui/themes";

export default function PlayerCardOverlay({ name, number, position }: Player) {
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
        <Badge size="2" color="gray">
          <Text size="1" weight="bold" color="gray">
            #{number}
          </Text>
        </Badge>
      </Flex>
      <Separator size="4" />
      <Button variant="soft" size="1" color="gray">
        Show Availabilities
      </Button>
    </Flex>
  );
}
