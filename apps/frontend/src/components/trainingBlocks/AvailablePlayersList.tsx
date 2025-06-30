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
  const { setNodeRef, isOver } = useDroppable({
    id: "availablePlayers",
  });

  const style = {
    backgroundColor: isOver ? "var(--green-3)" : "",
  };

  return (
    <Card size="2">
      <Flex justify="between" align="center" mb="3">
        <Heading>Available Players</Heading>
        <Badge>{availablePlayers.length}</Badge>
      </Flex>
      <Flex
        ref={setNodeRef}
        direction="column"
        justify="start"
        align="center"
        gap="3"
        p="2"
        maxHeight="600px"
        overflowY="scroll"
        style={{
          ...style,
          border: "1px dashed var(--gray-6)",
          borderRadius: "12px",
        }}
      >
        {availablePlayers.map((availablePlayer) => (
          <PlayerCard key={availablePlayer.id} {...availablePlayer} />
        ))}
      </Flex>
    </Card>
  );
}
