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
import { type ChangeEvent, useRef } from "react";
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

    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const exportJSON = () => {
        const jsonData = new Blob([JSON.stringify(players)], {
            type: "application/json",
        });

        const jsonURL = URL.createObjectURL(jsonData);

        const link = document.createElement("a");

        link.href = jsonURL;
        link.download = "players.json";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const selectedPlayerIds = table
        .getFilteredSelectedRowModel()
        .rows.map((row) => (row.original as Player).id);

    const handleRemovePlayers = async () => {
        if (!user) {
            throw new Error("User not authenticated");
        }

        const batch = writeBatch(clientFirestore);
        selectedPlayerIds.forEach((selectedPlayerId) => {
            batch.delete(
                doc(
                    clientFirestore,
                    `users/${user.uid!}/players/${selectedPlayerId}`,
                ),
            );
        });

        await batch.commit();
        table.resetRowSelection();
    };

    const importJSON = (event: ChangeEvent<HTMLInputElement>) => {
        if (!user) {
            throw new Error("User not authenticated");
        }

        if (event.target.files) {
            const fileReader = new FileReader();

            fileReader.onload = async (event) => {
                if (event.target) {
                    const deletePlayerBatch = writeBatch(clientFirestore);

                    players.forEach((player) => {
                        deletePlayerBatch.delete(
                            doc(
                                clientFirestore,
                                `users/${user.uid!}/players/${player.id!}`,
                            ),
                        );
                    });

                    const addPlayerBatch = writeBatch(clientFirestore);

                    const parsedPlayers: Player[] = JSON.parse(
                        event.target.result as string,
                    );

                    parsedPlayers.forEach((player) => {
                        addPlayerBatch.set(
                            doc(
                                clientFirestore,
                                `users/${user.uid!}/players`,
                                player.id,
                            ),
                            {
                                name: player.name,
                                number: player.number,
                                position: player.position,
                                availabilities: player.availabilities,
                            },
                        );
                    });

                    await deletePlayerBatch.commit();

                    await addPlayerBatch.commit();
                }
            };

            fileReader.readAsText(event.target.files[0]);
        }
    };

    return (
        <>
            <Flex
                direction={{
                    initial: "column",
                    sm: "row",
                }}
                justify="between"
                align={{
                    initial: "start",
                    sm: "center",
                }}
                gap={{
                    initial: "4",
                    sm: "0",
                }}
                mb="4"
            >
                <Flex align="center" gap="2" wrap="wrap">
                    <AddPlayerDialog user={user} />
                    <Button variant="outline" onClick={exportJSON}>
                        <DownloadIcon size={15} />
                        Export JSON
                    </Button>
                    <input
                        id="import-json"
                        ref={fileInputRef}
                        name="import-json"
                        type="file"
                        accept=".json, application/json"
                        onChange={importJSON}
                        style={{ display: "none" }}
                    />
                    <label htmlFor="import-json">
                        <Button
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <UploadIcon size={15} />
                            Import JSON
                        </Button>
                    </label>
                </Flex>
                <Box
                    width={{
                        initial: "100%",
                        sm: "250px",
                    }}
                >
                    <TextField.Root
                        id="search"
                        name="search"
                        placeholder="Search players by name"
                        value={
                            (table
                                .getColumn("name")
                                ?.getFilterValue() as string) ?? ""
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
            {selectedPlayerIds.length > 0 && (
                <Card mb="4">
                    <Flex justify="start" align="center" gap="2" wrap="wrap">
                        <Text color="gray" weight="medium" size="2" wrap="nowrap">
                            {selectedPlayerIds.length} players selected
                        </Text>
                        <Separator orientation="vertical" size="1" />
                        <Button color="red" onClick={handleRemovePlayers}>
                            <TrashIcon size={15} />
                            Delete Selected
                        </Button>
                    </Flex>
                </Card>
            )}
        </>
    );
}
