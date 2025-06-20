import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { EllipsisIcon } from "lucide-react";
import { usePlayers } from "../../hooks/usePlayers.ts";
import type { Table } from "@tanstack/react-table";
import type { Player } from "../../utils/types.ts";

type PlayerActionsDropdownProps<TData> = {
    player: Player;
    table: Table<TData>;
};

export default function PlayerActionsDropdown<TData>({
    player,
    table,
}: PlayerActionsDropdownProps<TData>) {
    const { removePlayer } = usePlayers();

    const handleRemovePlayer = async () => {
        await removePlayer(player.id);
        table.resetRowSelection();
    };

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <IconButton variant="ghost" color="gray">
                    <EllipsisIcon size={15} />
                </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="center">
                <DropdownMenu.Item>
                    Edit
                </DropdownMenu.Item>
                <DropdownMenu.Item color="red" onClick={handleRemovePlayer}>
                    Delete
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
}
