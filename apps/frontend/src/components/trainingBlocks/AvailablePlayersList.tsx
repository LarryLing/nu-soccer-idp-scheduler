import type { Player } from "../../utils/types.ts";
import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Select,
  Text,
  TextField,
} from "@radix-ui/themes";
import PlayerCard from "./PlayerCard.tsx";
import { useDroppable } from "@dnd-kit/core";
import { FilterIcon, SearchIcon } from "lucide-react";
import { DAYS, POSITION_OPTIONS } from "../../utils/constants.ts";
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
  const [dayFilter, setDayFilter] = useState("All");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

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

      const matchesDay =
        dayFilter === "All" || player.availabilities.some((availability) => availability.day === dayFilter);

      const matchesSearch =
        searchValue === "" ||
        player.name.toLowerCase().includes(searchValue.toLowerCase()) ||
        player.number.toString().includes(searchValue);

      return matchesPosition && matchesSearch && matchesDay;
    });
  }, [players, availablePlayerIds, positionFilter, searchValue]);

  return (
    <Card size="2">
      <Flex justify="between" align="center" mb="3">
        <Heading>Available Players</Heading>
        <Badge>{filteredAvailablePlayers.length}</Badge>
      </Flex>
      <Box mb="3">
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
        <Button onClick={() => setIsFiltersOpen(!isFiltersOpen)} color="gray" variant="outline" mb="3">
          <FilterIcon size={15} />
          Filters
        </Button>
        {isFiltersOpen && (
          <Flex justify="between" mb="3" gap="4" p="2" direction="column" style={{
            border: "1px solid var(--gray-6)",
            backgroundColor: "var(--gray-2)",
            borderRadius: "12px",
          }}>
            <Box>
              <Text size="2" color="gray" weight="bold" as="p" mb="2">
                Day
              </Text>
              <Box>
                <Select.Root value={dayFilter} onValueChange={setDayFilter}>
                  <Select.Trigger style={{ width: "100%" }} />
                  <Select.Content style={{ width: "100%" }}>
                    <Select.Item value="All">All Days</Select.Item>
                    {DAYS.map((day) => (
                      <Select.Item key={day} value={day}>
                        {day}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Box>
            </Box>
            <Box>
              <Text size="2" color="gray" weight="bold" as="p" mb="2">
                Position
              </Text>
              <Box width="100%">
                <Select.Root value={positionFilter} onValueChange={setPositionFilter}>
                  <Select.Trigger style={{ width: "100%" }} />
                  <Select.Content style={{ width: "100%" }}>
                    <Select.Item value="All">All Positions</Select.Item>
                    {POSITION_OPTIONS.map((position) => (
                      <Select.Item key={position} value={position}>
                        {position}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Box>
            </Box>
          </Flex>
        )}
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
