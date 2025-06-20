import type { ColumnDef } from "@tanstack/react-table";
import type { Availability, Player } from "../../utils/types.ts";
import PlayerActionsDropdown from "../../components/players/PlayerActionsDropdown.tsx";
import { Badge, Button, Checkbox, Text } from "@radix-ui/themes";
import { ArrowDownUpIcon } from "lucide-react";

export const columns: ColumnDef<Player>[] = [
    {
        accessorKey: "select",
        header: ({ table }) => (
            <Checkbox
                checked={
                    table.getIsAllPageRowsSelected() ||
                    (table.getIsSomePageRowsSelected() && "indeterminate")
                }
                onCheckedChange={(value) =>
                    table.toggleAllPageRowsSelected(!!value)
                }
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
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
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
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
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
                    onClick={() =>
                        column.toggleSorting(column.getIsSorted() === "asc")
                    }
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
            const availabilities: Availability[] =
                row.getValue("availabilities");
            return availabilities.map((availability) => (
                <Badge
                    key={`${availability.day} ${availability.start} ${availability.end}`}
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
            return (
                <PlayerActionsDropdown player={row.original} table={table} />
            );
        },
    },
];
