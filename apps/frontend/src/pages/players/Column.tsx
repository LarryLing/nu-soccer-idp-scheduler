import type { ColumnDef } from "@tanstack/react-table";
import type { Availability, Player } from "../../utils/types.ts";
import AvailabilityBadge from "../../components/players/AvailabilityBadge.tsx";
import PositionBadge from "../../components/players/PositionBadge.tsx";
import PlayerActionsDropdown from "../../components/players/PlayerActionsDropdown.tsx";
import { Button, Checkbox, Text } from "@radix-ui/themes";
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
            const position:
                | "Goalkeeper"
                | "Defender"
                | "Midfielder"
                | "Forward" = row.getValue("position");
            return <PositionBadge position={position} />;
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
            return availabilities.map((availability, index) => (
                <AvailabilityBadge key={index} {...availability} />
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
                <PlayerActionsDropdown
                    playerId={row.original.id}
                    table={table}
                />
            );
        },
    },
];
