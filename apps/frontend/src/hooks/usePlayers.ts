import { useCallback, useEffect, useState } from "react";
import type { Player } from "../utils/types.ts";
import { z } from "zod";
import { PlayerSchema } from "../utils/schemas.ts";
import {
    addDoc,
    collection,
    deleteDoc,
    updateDoc,
    doc,
    onSnapshot,
    orderBy,
    query,
    writeBatch,
} from "firebase/firestore";
import { clientFirestore } from "../utils/firebase.ts";
import { useUser } from "./useUser.ts";

export const usePlayers = () => {
    const [players, setPlayers] = useState<Player[]>([]);

    const { user } = useUser();

    const addPlayer = useCallback(
        async (player?: z.infer<typeof PlayerSchema>) => {
            if (!player) {
                throw new Error("Player is required");
            }

            if (!user) {
                throw new Error("User not authenticated");
            }

            await addDoc(
                collection(clientFirestore, `users/${user.uid}/players/`),
                player,
            );
        },
        [user],
    );

    const removePlayer = useCallback(
        async (playerId?: string) => {
            if (!playerId) {
                throw new Error("Player ID is required");
            }

            if (!user) {
                throw new Error("User not authenticated");
            }

            await deleteDoc(
                doc(clientFirestore, `users/${user.uid!}/players/${playerId}`),
            );
        },
        [user],
    );

    const removePlayers = useCallback(
        async (playerIds?: string[]) => {
            if (!playerIds) {
                throw new Error("Player IDs are required");
            }

            if (!user) {
                throw new Error("User not authenticated");
            }

            const batch = writeBatch(clientFirestore);
            playerIds.forEach((playerId) => {
                batch.delete(
                    doc(
                        clientFirestore,
                        `users/${user.uid!}/players/${playerId}`,
                    ),
                );
            });

            await batch.commit();
        },
        [user],
    );

    const editPlayer = useCallback(
        async (playerId?: string, data?: z.infer<typeof PlayerSchema>) => {
            if (!playerId) {
                throw new Error("Player ID is required");
            }

            if (!data) {
                throw new Error("Data is required");
            }

            await updateDoc(
                doc(clientFirestore, `users/${user!.uid}/players/${playerId}`),
                data,
            );
        },
        [user],
    );

    const exportJSON = useCallback(() => {
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
    }, [players]);

    const importJSON = useCallback(
        (file: Blob) => {
            if (!user) {
                throw new Error("User not authenticated");
            }

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

            fileReader.readAsText(file);
        },
        [players, user],
    );

    useEffect(() => {
        if (!user) {
            return;
        }

        const playersQuery = query(
            collection(clientFirestore, `users/${user.uid}/players`),
            orderBy("number", "asc"),
        );

        const unsubscribe = onSnapshot(playersQuery, (snapshot) => {
            setPlayers(
                snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                })) as Player[],
            );
        });

        return () => unsubscribe();
    }, [user]);

    return {
        players,
        addPlayer,
        removePlayer,
        removePlayers,
        editPlayer,
        exportJSON,
        importJSON,
    };
};
