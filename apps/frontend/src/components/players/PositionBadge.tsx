import { Badge } from "@radix-ui/themes";

type PositionBadgeProps = {
    position: "Goalkeeper" | "Defender" | "Midfielder" | "Forward";
};

export default function PositionBadge({ position }: PositionBadgeProps) {
    return (
        <Badge variant="soft" color="gray">
            {position}
        </Badge>
    );
}
