import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { EllipsisIcon } from "lucide-react";
import { useFirestore } from "../../hooks/useFirestore.ts";
import type { Table } from "@tanstack/react-table";
import type { Player } from "../../utils/types.ts";
import { usePlayerDialog } from "../../hooks/usePlayerDialog.ts";

type PlayerActionsDropdownProps<TData> = {
    player: Player;
    table: Table<TData>;
};

export default function PlayerActionsDropdown<TData>({
    player,
    table,
}: PlayerActionsDropdownProps<TData>) {
    const { removePlayer } = useFirestore();

    const { handleOpen } = usePlayerDialog();

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
