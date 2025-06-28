import {
  Badge,
  Button,
  Checkbox,
  Heading,
  Section,
  Text,
} from "@radix-ui/themes";
import { PlayerTable } from "../../components/players/PlayerTable.tsx";
import { useEffect, useMemo, useState } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import type { Availability, Player } from "../../utils/types.ts";
import PlayerTableActionRow from "../../components/players/PlayerTableActionRow.tsx";
import { ArrowDownUpIcon } from "lucide-react";
import PlayerActionsDropdown from "../../components/players/PlayerActionsDropdown.tsx";
import { EditPlayerDialogProvider } from "../../contexts/EditPlayerDialogProvider.tsx";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { clientFirestore } from "../../utils/firebase.ts";
import { useUser } from "../../hooks/useUser.ts";

const createPlayerColumns = (): ColumnDef<Player>[] => [
  {
    accessorKey: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selected row"
      />
    ),
    enableSorting: false,
  },
  {
    accessorKey: "number",
    header: ({ column }) => {
      return (
        <Button
          color="gray"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Text weight="bold" mr="1">
            Number
          </Text>
          <ArrowDownUpIcon size={15} />
        </Button>
      );
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          color="gray"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Text weight="bold" mr="1">
            Name
          </Text>
          <ArrowDownUpIcon size={15} />
        </Button>
      );
    },
  },
  {
    accessorKey: "position",
    header: ({ column }) => {
      return (
        <Button
          color="gray"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          <Text weight="bold" mr="1">
            Position
          </Text>
          <ArrowDownUpIcon size={15} />
        </Button>
      );
    },
    cell: ({ row }) => {
      const position: Player["position"] = row.getValue("position");
      return (
        <Badge variant="soft" color="gray">
          {position}
        </Badge>
      );
    },
  },
  {
    accessorKey: "availabilities",
    header: () => {
      return (
        <Text color="gray" weight="bold" mr="1">
          Availabilities
        </Text>
      );
    },
    cell: ({ row }) => {
      const availabilities: Availability[] = row.getValue("availabilities");
      return availabilities.map((availability, index) => (
        <Badge
          key={`${availability.day}.${availability.start}.${availability.end}.${index}`}
          variant="outline"
          color="gray"
          mr="2"
        >
          {availability.day} {availability.start} - {availability.end}
        </Badge>
      ));
    },
  },
  {
    id: "actions",
    header: () => {
      return (
        <Text color="gray" weight="bold" mr="1">
          Actions
        </Text>
      );
    },
    cell: ({ table, row }) => {
      return <PlayerActionsDropdown player={row.original} table={table} />;
    },
  },
];

export default function Players() {
  const { user } = useUser();

  const [players, setPlayers] = useState<Player[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});

  const columns = useMemo(() => createPlayerColumns(), []);

  const table = useReactTable({
    data: players || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  });

  useEffect(() => {
    if (!user) {
      return;
    }

    const playersQuery = query(
      collection(clientFirestore, `users/${user.uid}/players`),
      orderBy("number", "asc"),
    );

    const unsubscribe = onSnapshot(playersQuery, (snapshot) => {
      setPlayers(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Player[],
      );
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <>
      <Section p="0">
        <Heading size="9" mb="3">
          Manage Players
        </Heading>
        <Text size="3" weight="medium">
          Add, remove, or edit player information
        </Text>
      </Section>
      <Section p="0">
        <PlayerTableActionRow table={table} players={players} />
        <EditPlayerDialogProvider>
          <PlayerTable
            table={table}
            numColumns={columns.length}
            players={players}
          />
        </EditPlayerDialogProvider>
      </Section>
    </>
  );
}
