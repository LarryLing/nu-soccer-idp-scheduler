import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { EllipsisIcon } from "lucide-react";
import { useFirestore } from "../../hooks/useFirestore.ts";
import type { Table } from "@tanstack/react-table";

type PlayerActionsDropdownProps<TData> = {
    playerId: string;
    table: Table<TData>;
};

export default function PlayerActionsDropdown<TData>({
    playerId,
    table,
}: PlayerActionsDropdownProps<TData>) {
    const { removePlayer } = useFirestore();

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <IconButton variant="ghost" color="gray">
                    <EllipsisIcon size={15} />
                </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content align="center">
                <DropdownMenu.Item>Edit</DropdownMenu.Item>
                <DropdownMenu.Item
                    color="red"
                    onClick={() => {
                        removePlayer(playerId);
                        table.resetRowSelection();
                    }}
                >
                    Delete
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
}
