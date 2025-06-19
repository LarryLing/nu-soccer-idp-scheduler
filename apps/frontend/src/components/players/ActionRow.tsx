import {
    Box,
    Button,
    Flex,
    Separator,
    Text,
    TextField,
} from "@radix-ui/themes";
import type { Table } from "@tanstack/react-table";
import {
    DownloadIcon,
    PlusIcon,
    SearchIcon,
    TrashIcon,
    UploadIcon,
} from "lucide-react";
import { useFirestore } from "../../hooks/useFirestore.ts";
import type { Player } from "../../utils/types.ts";

type ActionRowProps<TData> = {
    table: Table<TData>;
};

export function ActionRow<TData>({ table }: ActionRowProps<TData>) {
    const { removePlayers } = useFirestore();

    const selectedPlayerIds = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => (row.original as Player).id);

    const handleRemovePlayers = () => {
        removePlayers(selectedPlayerIds);
        table.resetRowSelection();
    };

    return (
        <Flex justify="between" align="center" mb="5">
            <Flex align="center" gap="3">
                <Button>
                    <PlusIcon size={15} />
                    Add Player
                </Button>
                <Button variant="outline">
                    <DownloadIcon size={15} />
                    Export JSON
                </Button>
                <Button variant="outline">
                    <UploadIcon size={15} />
                    Import JSON
                </Button>
                {selectedPlayerIds.length > 0 && (
                    <>
                        <Separator size="2" orientation="vertical" />
                        <Text>{selectedPlayerIds.length} selected</Text>
                        <Button color="red" onClick={handleRemovePlayers}>
                            <TrashIcon size={15} />
                            Delete Selected
                        </Button>
                    </>
                )}
            </Flex>
            <Box width="250px" maxWidth="250px">
                <TextField.Root
                    id="search"
                    name="search"
                    placeholder="Search players by name..."
                    value={
                        (table.getColumn("name")?.getFilterValue() as string) ??
                        ""
                    }
                    onChange={(event) =>
                        table
                            .getColumn("name")
                            ?.setFilterValue(event.target.value)
                    }
                >
                    <TextField.Slot>
                        <SearchIcon size={15} />
                    </TextField.Slot>
                </TextField.Root>
            </Box>
        </Flex>
    );
}
