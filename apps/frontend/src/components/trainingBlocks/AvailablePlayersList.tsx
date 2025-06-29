import type { Player } from "../../utils/types.ts";
import { Badge, Card, Flex, Heading } from "@radix-ui/themes";
import PlayerCard from "./PlayerCard.tsx";

type AvailablePlayersListProps = {
  players: Player[];
};

export function AvailablePlayersList({ players }: AvailablePlayersListProps) {
  return (
    <Card size="2">
      <Flex justify="between" align="center" mb="3">
        <Heading>Available Players</Heading>
        <Badge>{players.length}</Badge>
      </Flex>
      <Flex direction="column" gap="3" maxHeight="600px" overflowY="scroll">
        {players.map((player) => (
          <PlayerCard key={player.id} {...player} />
        ))}
      </Flex>
    </Card>
  );
}
