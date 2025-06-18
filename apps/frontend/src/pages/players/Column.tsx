import type { ColumnDef } from "@tanstack/react-table";
import type { Availability, Player } from "../../utils/types.ts";
import AvailabilityBadge from "../../components/players/AvailabilityBadge.tsx";
import PositionBadge from "../../components/players/PositionBadge.tsx";

export const columns: ColumnDef<Player>[] = [
    {
        accessorKey: "number",
        header: "Number",
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "position",
        header: "Position",
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
        accessorKey: "availability",
        header: "Availability",
        cell: ({ row }) => {
            const availabilities: Availability[] = row.getValue("availability");
            return availabilities.map((availability) => (
                <AvailabilityBadge {...availability} />
            ));
        },
    },
];
