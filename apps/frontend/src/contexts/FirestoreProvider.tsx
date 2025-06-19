import { type PropsWithChildren, useEffect, useState } from "react";
import type { Player, TrainingBlock } from "../utils/types.ts";
import { FirestoreContext } from "./FirestoreContext.tsx";
import {
    collection,
    query,
    getDocs,
    orderBy,
    deleteDoc,
    doc,
} from "firebase/firestore";
import { clientFirestore } from "../utils/firebase.ts";
import { FirebaseError } from "firebase/app";

type FirestoreProviderProps = {
    userId: string;
} & PropsWithChildren;

export function FirestoreProvider({
    userId,
    children,
}: FirestoreProviderProps) {
    const [players, setPlayers] = useState<Player[]>([]);
    const [trainingBlocks, setTrainingBlocks] = useState<TrainingBlock[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const addPlayer = async (player?: Player) => {
        if (!player) {
            throw new Error("Player is required");
        }

        setPlayers((prev) => [...prev, player]);
    };

    const removePlayer = async (playerId?: string) => {
        if (!playerId) {
            throw new Error("Player ID is required");
        }

        setPlayers((prev) => prev.filter((player) => player.id !== playerId));

        await deleteDoc(doc(clientFirestore, `users/${userId!}/players/${playerId}`))
    };

    const removePlayers = async (playerIds?: string[]) => {
        if (!playerIds) {
            throw new Error("Player IDs are required");
        }

        setPlayers((prev) =>
            prev.filter((player) => !playerIds.includes(player.id)),
        );
    };

    const addTrainingBlock = async (trainingBlock?: TrainingBlock) => {
        if (!trainingBlock) {
            throw new Error("Training block is required");
        }

        setTrainingBlocks((prev) => [...prev, trainingBlock]);
    };

    const removeTrainingBlock = async (trainingBlockId?: string) => {
        if (!trainingBlockId) {
            throw new Error("Training block ID is required");
        }

        setTrainingBlocks((prev) =>
            prev.filter(
                (trainingBlock) => trainingBlock.id !== trainingBlockId,
            ),
        );
    };

    const assignPlayerToTrainingBlock = async (
        trainingBlockId?: string,
        playerId?: string,
    ) => {
        if (!playerId || !trainingBlockId) {
            throw new Error("Player ID and training block ID are required");
        }

        return;
    };

    const unassignPlayerFromTrainingBlock = async (
        trainingBlockId?: string,
        playerId?: string,
    ) => {
        if (!playerId || !trainingBlockId) {
            throw new Error("Player ID and training block ID are required");
        }

        return;
    };

    useEffect(() => {
        async function fetchData() {
            const playersQuery = query(
                collection(clientFirestore, `users/${userId!}/players`),
                orderBy("number", "asc"),
            );
            const trainingBlocksQuery = query(
                collection(clientFirestore, `users/${userId!}/trainingBlocks`),
            );

            const responses = await Promise.all([
                await getDocs(playersQuery),
                await getDocs(trainingBlocksQuery),
            ]);

            setPlayers(
                responses[0].docs.map(
                    (doc) =>
                        ({
                            id: doc.id,
                            ...doc.data(),
                        }) as Player,
                ),
            );
            setTrainingBlocks(
                responses[1].docs.map(
                    (doc) =>
                        ({
                            id: doc.id,
                            ...doc.data(),
                        }) as TrainingBlock,
                ),
            );
        }

        try {
            fetchData();
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error(error.message);
            }
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    const value = {
        players: players,
        trainingBlocks: trainingBlocks,
        isLoading: isLoading,
        addPlayer: addPlayer,
        removePlayer: removePlayer,
        removePlayers: removePlayers,
        addTrainingBlock: addTrainingBlock,
        removeTrainingBlock: removeTrainingBlock,
        assignPlayerToTrainingBlock: assignPlayerToTrainingBlock,
        unassignPlayerFromTrainingBlock: unassignPlayerFromTrainingBlock,
    };

    return (
        <FirestoreContext.Provider value={value}>
            {!isLoading && children}
        </FirestoreContext.Provider>
    );
}
