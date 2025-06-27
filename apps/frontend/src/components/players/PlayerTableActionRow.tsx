import {
    Box,
    Button,
    Card,
    Flex,
    Separator,
    Text,
    TextField,
} from "@radix-ui/themes";
import AddPlayerDialog from "./AddPlayerDialog.tsx";
import { DownloadIcon, SearchIcon, TrashIcon, UploadIcon } from "lucide-react";
import type { Player } from "../../utils/types.ts";
import type { Table } from "@tanstack/react-table";
import { type ChangeEvent, useRef, useState } from "react";
import { doc, writeBatch } from "firebase/firestore";
import { clientFirestore } from "../../utils/firebase.ts";
import { useUser } from "../../hooks/useUser.ts";

type PlayerTableActionRowProps = {
    table: Table<Player>;
    players: Player[];
};

export default function PlayerTableActionRow({
    table,
    players,
}: PlayerTableActionRowProps) {
    const { user } = useUser();

    const fileInputRef = useRef<HTMLInputElement>(null);

    const [isImporting, setIsImporting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const selectedPlayerIds = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => row.original.id);

    const searchValue =
        (table.getColumn("name")?.getFilterValue() as string) ?? "";

    const exportJSON = () => {
        try {
            const jsonData = new Blob([JSON.stringify(players, null, 2)], {
                type: "application/json",
            });

            const jsonURL = URL.createObjectURL(jsonData);
            const link = document.createElement("a");

            link.href = jsonURL;
            link.download = `players_${new Date().toISOString().split("T")[0]}.json`;
            link.click();

            setTimeout(() => URL.revokeObjectURL(jsonURL), 100);
        } catch (error) {
            console.error("Failed to export JSON:", error);
        }
    };

    const handleRemovePlayers = async () => {
        if (!user?.uid) {
            console.error("User not authenticated");
            return;
        }

        if (selectedPlayerIds.length === 0) return;

        setIsDeleting(true);
        try {
            const batch = writeBatch(clientFirestore);

            selectedPlayerIds.forEach((playerId) => {
                batch.delete(
                    doc(
                        clientFirestore,
                        `users/${user.uid}/players/${playerId}`,
                    ),
                );
            });

            await batch.commit();
            table.resetRowSelection();
        } catch (error) {
            console.error("Failed to delete players:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const validatePlayerData = (data: unknown): data is Player[] => {
        if (!Array.isArray(data)) return false;

        return data.every(
            (item) =>
                typeof item === "object" &&
                item !== null &&
                "id" in item &&
                "name" in item &&
                "number" in item &&
                "position" in item &&
                "availabilities" in item,
        );
    };

    const importJSON = async (event: ChangeEvent<HTMLInputElement>) => {
        if (!user?.uid) {
            console.error("User not authenticated");
            return;
        }

        const file = event.target.files?.[0];
        if (!file) return;

        if (!file.type.includes("json")) {
            console.error("Invalid file type. Please select a JSON file.");
            return;
        }

        if (file.size > 10 * 1024 * 1024) {
            console.error("File too large. Maximum size is 10MB.");
            return;
        }

        setIsImporting(true);

        try {
            const text = await file.text();
            const parsedPlayers = JSON.parse(text);

            if (!validatePlayerData(parsedPlayers)) {
                throw new Error("Invalid player data format");
            }

            const batch = writeBatch(clientFirestore);

            players.forEach((player) => {
                if (player.id) {
                    batch.delete(
                        doc(
                            clientFirestore,
                            `users/${user.uid}/players/${player.id}`,
                        ),
                    );
                }
            });

            parsedPlayers.forEach((player) => {
                if (player.id) {
                    batch.set(
                        doc(
                            clientFirestore,
                            `users/${user.uid}/players/${player.id}`,
                        ),
                        {
                            name: player.name,
                            number: player.number,
                            position: player.position,
                            availabilities: player.availabilities,
                        },
                    );
                }
            });

            await batch.commit();
        } catch (error) {
            console.error("Failed to import JSON:", error);
        } finally {
            setIsImporting(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        table.getColumn("name")?.setFilterValue(event.target.value);
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            <Flex
                direction={{ initial: "column", sm: "row" }}
                justify="between"
                align={{ initial: "start", sm: "center" }}
                gap={{ initial: "4", sm: "0" }}
                mb="4"
            >
                <Flex align="center" gap="2" wrap="wrap">
                    <AddPlayerDialog user={user} players={players} />
                    <Button variant="outline" onClick={exportJSON}>
                        <DownloadIcon size={15} />
                        Export JSON
                    </Button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json,application/json"
                        onChange={importJSON}
                        style={{ display: "none" }}
                        aria-label="Import JSON file"
                    />
                    <Button
                        variant="outline"
                        onClick={handleImportClick}
                        disabled={isImporting}
                    >
                        <UploadIcon size={15} />
                        {isImporting ? "Importing..." : "Import JSON"}
                    </Button>
                </Flex>
                <Box width={{ initial: "100%", sm: "210px" }}>
                    <TextField.Root
                        placeholder="Search players by name"
                        value={searchValue}
                        onChange={handleSearchChange}
                    >
                        <TextField.Slot>
                            <SearchIcon size={15} />
                        </TextField.Slot>
                    </TextField.Root>
                </Box>
            </Flex>
            {selectedPlayerIds.length > 0 && (
                <Card mb="4">
                    <Flex justify="start" align="center" gap="2" wrap="wrap">
                        <Text
                            color="gray"
                            weight="medium"
                            size="2"
                            wrap="nowrap"
                        >
                            {selectedPlayerIds.length} player
                            {selectedPlayerIds.length !== 1 ? "s" : ""} selected
                        </Text>
                        <Separator orientation="vertical" size="1" />
                        <Button
                            color="red"
                            onClick={handleRemovePlayers}
                            disabled={isDeleting}
                        >
                            <TrashIcon size={15} />
                            {isDeleting ? "Deleting..." : "Delete Selected"}
                        </Button>
                    </Flex>
                </Card>
            )}
        </>
    );
}
