import { DropdownMenu, IconButton } from "@radix-ui/themes";
import { EllipsisIcon } from "lucide-react";

export default function PlayerActionsDropdown() {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <IconButton variant="ghost" color="gray">
                    <EllipsisIcon size={15} />
                </IconButton>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                <DropdownMenu.Item shortcut="⌘ E">Edit</DropdownMenu.Item>
                <DropdownMenu.Item color="red" shortcut="Del">
                    Delete
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
}
