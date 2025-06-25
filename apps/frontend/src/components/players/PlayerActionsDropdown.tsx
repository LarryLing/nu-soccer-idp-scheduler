import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { EllipsisIcon } from "lucide-react";
import { usePlayers } from "../../hooks/usePlayers.ts";
import type { Table } from "@tanstack/react-table";
import type { Player } from "../../utils/types.ts";
import { useEditPlayerDialog } from "../../hooks/useEditPlayerDialog.ts";

type PlayerActionsDropdownProps = {
    player: Player;
    table: Table<Player>;
};

export default function PlayerActionsDropdown({
    player,
    table,
}: PlayerActionsDropdownProps) {
    const { removePlayer } = usePlayers();

    const { handleOpen } = useEditPlayerDialog();

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
                <DropdownMenu.Item onClick={() => handleOpen(player)}>
                    Edit
                </DropdownMenu.Item>
                <DropdownMenu.Item color="red" onClick={handleRemovePlayer}>
                    Delete
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
}
