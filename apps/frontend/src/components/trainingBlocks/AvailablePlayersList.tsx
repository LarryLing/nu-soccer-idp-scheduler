import type { Player } from "../../utils/types.ts";
import { Badge, Card, Flex, Heading } from "@radix-ui/themes";
import PlayerCard from "./PlayerCard.tsx";
import { useDroppable } from "@dnd-kit/core";

type AvailablePlayersListProps = {
  availablePlayers: Player[];
};

export function AvailablePlayersList({
  availablePlayers,
}: AvailablePlayersListProps) {
  const { setNodeRef } = useDroppable({
    id: "availablePlayers",
  });

  return (
    <Card size="2">
      <Flex justify="between" align="center" mb="3">
        <Heading>Available Players</Heading>
        <Badge>{availablePlayers.length}</Badge>
      </Flex>
      <Flex
        ref={setNodeRef}
        direction="column"
        gap="3"
        maxHeight="600px"
        overflowY="scroll"
      >
        {availablePlayers.map((availablePlayer) => (
          <PlayerCard key={availablePlayer.id} {...availablePlayer} />
        ))}
      </Flex>
    </Card>
  );
}
