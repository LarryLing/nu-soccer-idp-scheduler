import {
    Box,
    Button,
    Flex,
    IconButton,
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
import { type ChangeEvent, useRef } from "react";

type PlayerTableActionRowProps = {
    table: Table<Player>;
    selectedPlayerIds: string[];
    addPlayer: (player?: z.infer<typeof PlayerSchema>) => Promise<void>;
    exportJSON: () => void;
    importJSON: (file: Blob) => void;
    handleRemovePlayers: () => void;
};

export default function PlayerTableActionRow({
    table,
    selectedPlayerIds,
    addPlayer,
    exportJSON,
    importJSON,
    handleRemovePlayers,
}: PlayerTableActionRowProps) {
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const onChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            importJSON(event.target.files[0]);
        }
    };

    return (
        <Flex justify="between" align="center" mb="5">
            <Flex align="center" gap="4">
                <AddPlayerDialog addPlayer={addPlayer} />
                <Box
                    display={{
                        initial: "none",
                        sm: "block",
                    }}
                >
                    <Button variant="outline" onClick={exportJSON}>
                        <DownloadIcon size={15} />
                        Export JSON
                    </Button>
                </Box>
                <Box
                    display={{
                        initial: "block",
                        sm: "none",
                    }}
                >
                    <IconButton variant="outline" onClick={exportJSON}>
                        <DownloadIcon size={15} />
                    </IconButton>
                </Box>
                <input
                    id="import-json"
                    ref={fileInputRef}
                    name="import-json"
                    type="file"
                    accept=".json, application/json"
                    onChange={onChange}
                    style={{ display: "none" }}
                />
                <Box
                    display={{
                        initial: "none",
                        sm: "block",
                    }}
                >
                    <label htmlFor="import-json">
                        <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <UploadIcon size={15} />
                            Import JSON
                        </Button>
                    </label>
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
                </Box>
                <Box
                    display={{
                        initial: "block",
                        sm: "none",
                    }}
                >
                    <label htmlFor="import-json">
                        <IconButton
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <UploadIcon size={15} />
                        </IconButton>
                    </label>
                </Box>
            </Flex>
            <Box
                width="200px"
                display={{
                    initial: "none",
                    xs: "block",
                }}
            >
                <TextField.Root
                    id="search"
                    name="search"
                    placeholder="Search players by name"
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
            <Box
                width="90px"
                display={{
                    initial: "block",
                    xs: "none",
                }}
            >
                <TextField.Root
                    id="search"
                    name="search"
                    placeholder="Search"
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
