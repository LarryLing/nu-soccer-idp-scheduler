import { Badge } from "@radix-ui/themes";
import type { Availability } from "../../utils/types.ts";

export default function AvailabilityBadge({ day, start, end }: Availability) {
    return (
        <Badge variant="outline" color="gray" mr="2">
            {day} {start} - {end}
        </Badge>
    );
}
