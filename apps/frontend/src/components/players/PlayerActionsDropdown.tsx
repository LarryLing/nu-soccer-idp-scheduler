import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { EllipsisIcon } from "lucide-react";
import type { Table } from "@tanstack/react-table";
import type { Player } from "../../utils/types.ts";
import { useEditPlayerDialog } from "../../hooks/useEditPlayerDialog.ts";
import { deleteDoc, doc } from "firebase/firestore";
import { clientFirestore } from "../../utils/firebase.ts";
import { useUser } from "../../hooks/useUser.ts";

type PlayerActionsDropdownProps = {
    player: Player;
    table: Table<Player>;
};

export default function PlayerActionsDropdown({
    player,
    table,
}: PlayerActionsDropdownProps) {
    const { user } = useUser();

    const { handleOpen } = useEditPlayerDialog();

    const handleRemovePlayer = async () => {
        if (!user) {
            throw new Error("User not authenticated");
        }

        try {
            await deleteDoc(
                doc(clientFirestore, `users/${user.uid!}/players/${player.id}`),
            );

            table.resetRowSelection();
        } catch (error) {
            console.error("Failed to delete player:", error);
        }
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
