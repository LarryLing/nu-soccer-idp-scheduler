import type { Player } from "../../utils/types.ts";
import { Badge, Card, Flex, Heading } from "@radix-ui/themes";
import PlayerCard from "./PlayerCard.tsx";

type AvailablePlayersListProps = {
  players: Player[];
};

export function AvailablePlayersList({ players }: AvailablePlayersListProps) {
  return (
    <Card>
      <Flex justify="between" align="center" mb="3">
        <Heading>Available Players</Heading>
        <Badge>{players.length}</Badge>
      </Flex>
      <Flex direction="column" gap="2">
        {players.map((player) => (
          <PlayerCard {...player} />
        ))}
      </Flex>
    </Card>
  );
}
