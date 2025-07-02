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
import { DAYS, POSITIONS } from "../../utils/constants.ts";
import { useState } from "react";
import FormField from "../miscellaneous/FormField.tsx";

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

  const filteredAvailablePlayers = players.filter((player) => {
    const isAvailable = availablePlayerIds.includes(player.id);

    const matchesPosition =
      positionFilter === "All" || player.position === positionFilter;

    const matchesDay =
      dayFilter === "All" ||
      player.availabilities.some(
        (availability) => availability.day === dayFilter,
      );

    const matchesSearch =
      searchValue === "" ||
      player.name.toLowerCase().includes(searchValue.toLowerCase()) ||
      player.number.toString().includes(searchValue);

    return isAvailable && matchesPosition && matchesSearch && matchesDay;
  });

  const handleToggleFilters = () => setIsFiltersOpen(!isFiltersOpen);

  return (
    <Card size="2">
      <Flex justify="between" align="center" mb="3">
        <Heading>Available Players</Heading>
        <Badge size="2">{filteredAvailablePlayers.length}</Badge>
      </Flex>
      <SearchBar searchValue={searchValue} onSearchChange={setSearchValue} />
      <FilterControls
        isOpen={isFiltersOpen}
        onToggle={handleToggleFilters}
        dayFilter={dayFilter}
        onDayFilterChange={setDayFilter}
        positionFilter={positionFilter}
        onPositionFilterChange={setPositionFilter}
      />
      <PlayersDropZone filteredAvailablePlayers={filteredAvailablePlayers} />
    </Card>
  );
}

const SearchBar = ({
  searchValue,
  onSearchChange,
}: {
  searchValue: string;
  onSearchChange: (value: string) => void;
}) => (
  <Box mb="3">
    <TextField.Root
      placeholder="Search players"
      value={searchValue}
      onChange={(e) => onSearchChange(e.target.value)}
    >
      <TextField.Slot>
        <SearchIcon size={15} />
      </TextField.Slot>
    </TextField.Root>
  </Box>
);

const FilterControls = ({
  isOpen,
  onToggle,
  dayFilter,
  onDayFilterChange,
  positionFilter,
  onPositionFilterChange,
}: {
  isOpen: boolean;
  onToggle: () => void;
  dayFilter: string;
  onDayFilterChange: (value: string) => void;
  positionFilter: string;
  onPositionFilterChange: (value: string) => void;
}) => (
  <>
    <Button onClick={onToggle} color="gray" variant="outline" mb="3">
      <FilterIcon size={15} />
      Filters
    </Button>
    {isOpen && (
      <Box
        mb="3"
        p="2"
        style={{
          border: "1px solid var(--gray-6)",
          backgroundColor: "var(--gray-2)",
          borderRadius: "12px",
        }}
      >
        <FormField label="Day" id="day">
          <Select.Root value={dayFilter} onValueChange={onDayFilterChange}>
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
        </FormField>
        <FormField label="Position" id="position">
          <Select.Root
            value={positionFilter}
            onValueChange={onPositionFilterChange}
          >
            <Select.Trigger style={{ width: "100%" }} />
            <Select.Content style={{ width: "100%" }}>
              <Select.Item value="All">All Positions</Select.Item>
              {POSITIONS.map((position) => (
                <Select.Item key={position} value={position}>
                  {position}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </FormField>
      </Box>
    )}
  </>
);

const PlayersDropZone = ({
  filteredAvailablePlayers,
}: {
  filteredAvailablePlayers: Player[];
}) => {
  const { setNodeRef } = useDroppable({
    id: "availablePlayers",
  });

  return (
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
        filteredAvailablePlayers.map((filteredAvailablePlayer) => (
          <PlayerCard
            key={filteredAvailablePlayer.id}
            {...filteredAvailablePlayer}
          />
        ))
      )}
    </Flex>
  );
};
