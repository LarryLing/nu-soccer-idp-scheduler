import { useCallback, useEffect, useState } from "react";
import type { TrainingBlock } from "../utils/types.ts";
import { z } from "zod";
import { TrainingBlockSchema } from "../utils/schemas.ts";
import { collection, getDocs, query } from "firebase/firestore";
import { clientFirestore } from "../utils/firebase.ts";
import { FirebaseError } from "firebase/app";

export const useTrainingBlocks = (userId: string) => {
    const [trainingBlocks, setTrainingBlocks] = useState<TrainingBlock[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const addTrainingBlock = useCallback(
        async (trainingBlock?: z.infer<typeof TrainingBlockSchema>) => {
            if (!trainingBlock) {
                throw new Error("Training block is required");
            }

            setTrainingBlocks((prev) => [
                ...prev,
                {
                    ...trainingBlock,
                    id: "",
                    assignedPlayers: [],
                } as TrainingBlock,
            ]);
        },
        [],
    );

    const removeTrainingBlock = useCallback(
        async (trainingBlockId?: string) => {
            if (!trainingBlockId) {
                throw new Error("Training block ID is required");
            }

            setTrainingBlocks((prev) =>
                prev.filter(
                    (trainingBlock) => trainingBlock.id !== trainingBlockId,
                ),
            );
        },
        [],
    );

    const assignPlayerToTrainingBlock = useCallback(
        async (trainingBlockId?: string, playerId?: string) => {
            if (!playerId || !trainingBlockId) {
                throw new Error("Player ID and training block ID are required");
            }

            return;
        },
        [],
    );

    const unassignPlayerFromTrainingBlock = useCallback(
        async (trainingBlockId?: string, playerId?: string) => {
            if (!playerId || !trainingBlockId) {
                throw new Error("Player ID and training block ID are required");
            }

            return;
        },
        [],
    );

    useEffect(() => {
        async function fetchData() {
            const trainingBlocksQuery = query(
                collection(clientFirestore, `users/${userId!}/trainingBlocks`),
            );

            const fetchedTrainingBlockDocs = await getDocs(trainingBlocksQuery);

            setTrainingBlocks(
                fetchedTrainingBlockDocs.docs.map(
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

    return {
        trainingBlocks: trainingBlocks,
        isLoading: isLoading,
        addTrainingBlock: addTrainingBlock,
        removeTrainingBlock: removeTrainingBlock,
        assignPlayerToTrainingBlock: assignPlayerToTrainingBlock,
        unassignPlayerFromTrainingBlock: unassignPlayerFromTrainingBlock,
    };
};
