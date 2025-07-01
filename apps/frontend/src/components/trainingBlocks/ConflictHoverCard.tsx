import { Badge, Flex, Heading, HoverCard, Text } from "@radix-ui/themes";
import type { Player } from "../../utils/types.ts";
import { CircleAlert } from "lucide-react";

type ConflictHoverCardProps = {
  conflictPlayerNames: Player["name"][];
};

export function ConflictHoverCard({
  conflictPlayerNames,
}: ConflictHoverCardProps) {
  return (
    <HoverCard.Root>
      <HoverCard.Trigger>
        <Badge color="yellow">
          <CircleAlert size={15} />
        </Badge>
      </HoverCard.Trigger>
      <HoverCard.Content size="1">
        <Flex direction="column">
          <Heading size="2" as="h3" color="gray">
            The following players have time conflicts:
          </Heading>
          <Text size="2" color="gray">
            {conflictPlayerNames.join(", ")}
          </Text>
        </Flex>
      </HoverCard.Content>
    </HoverCard.Root>
  );
}
