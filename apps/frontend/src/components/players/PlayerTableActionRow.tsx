import {
    Box,
    Button,
    Flex,
    Separator,
    Text,
    TextField,
} from "@radix-ui/themes";
import AddPlayerDialog from "./AddPlayerDialog.tsx";
import { DownloadIcon, SearchIcon, TrashIcon, UploadIcon } from "lucide-react";
import type { Player } from "../../utils/types.ts";
import type { Table } from "@tanstack/react-table";
import type { PlayerSchema } from "../../utils/schemas.ts";
import { z } from "zod";

type PlayerTableActionRowProps = {
    table: Table<Player>;
    selectedPlayerIds: string[];
    addPlayer: (player?: z.infer<typeof PlayerSchema>) => Promise<void>;
    exportJSON: () => void;
    handleRemovePlayers: () => void;
};

export default function PlayerTableActionRow({
    table,
    selectedPlayerIds,
    addPlayer,
    exportJSON,
    handleRemovePlayers,
}: PlayerTableActionRowProps) {
    return (
        <Flex justify="between" align="center" mb="5">
            <Flex align="center" gap="3">
                <AddPlayerDialog addPlayer={addPlayer} />
                <Button variant="outline" onClick={exportJSON}>
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
