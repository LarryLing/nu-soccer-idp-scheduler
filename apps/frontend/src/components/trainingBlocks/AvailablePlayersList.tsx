import type { Player } from "../../utils/types.ts";
import {
  Badge,
  Box,
  Card,
  Flex,
  Heading,
  Select,
  Text,
  TextField,
} from "@radix-ui/themes";
import PlayerCard from "./PlayerCard.tsx";
import { useDroppable } from "@dnd-kit/core";
import { SearchIcon } from "lucide-react";
import { POSITION_OPTIONS } from "../../utils/constants.ts";
import { useMemo, useState } from "react";

type AvailablePlayersListProps = {
  availablePlayerIds: Player["id"][];
  players: Player[];
};

export function AvailablePlayersList({
  availablePlayerIds,
  players,
}: AvailablePlayersListProps) {
  const [searchValue, setSearchValue] = useState("");
  const [positionFilter, setPositionFilter] = useState("All");

  const { setNodeRef } = useDroppable({
    id: "availablePlayers",
  });

  const filteredAvailablePlayers = useMemo(() => {
    const availablePlayers = players.filter((player) =>
      availablePlayerIds.includes(player.id),
    );

    return availablePlayers.filter((player) => {
      const matchesPosition =
        positionFilter === "All" || player.position === positionFilter;

      const matchesSearch =
        searchValue === "" ||
        player.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        player.number.toString().includes(searchValue);

      return matchesPosition && matchesSearch;
    });
  }, [players, availablePlayerIds, positionFilter, searchValue]);

  return (
    <Card size="2">
      <Flex justify="between" align="center" mb="3">
        <Heading>Available Players</Heading>
        <Badge>{filteredAvailablePlayers.length}</Badge>
      </Flex>
      <Flex justify="between" mb="3" gap="4">
        <Box maxWidth="250px">
          <TextField.Root
            placeholder="Search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          >
            <TextField.Slot>
              <SearchIcon size={15} />
            </TextField.Slot>
          </TextField.Root>
        </Box>
        <Select.Root value={positionFilter} onValueChange={setPositionFilter}>
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="All">All Positions</Select.Item>
            {POSITION_OPTIONS.map((position) => (
              <Select.Item key={position} value={position}>
                {position}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </Flex>
      <Flex
        ref={setNodeRef}
        direction="column"
        justify="start"
        align="center"
        gap="3"
        p="2"
        minHeight="345px"
        maxHeight="600px"
        overflowY="scroll"
        style={{
          border: "1px dashed var(--gray-6)",
          borderRadius: "12px",
        }}
      >
        {filteredAvailablePlayers.length === 0 ? (
          <Text size="2" color="gray">
            No available players
          </Text>
        ) : (
          filteredAvailablePlayers.map((availablePlayer) => (
            <PlayerCard key={availablePlayer.id} {...availablePlayer} />
          ))
        )}
      </Flex>
    </Card>
  );
}
