import { createContext } from "react";
import type { FirestoreContextType } from "../utils/types.ts";

export const FirestoreContext = createContext<FirestoreContextType>({
    players: [],
    trainingBlocks: [],
    isLoading: false,
    addPlayer: async () => {},
    removePlayer: async () => {},
    removePlayers: async () => {},
    addTrainingBlock: async () => {},
    removeTrainingBlock: async () => {},
    assignPlayerToTrainingBlock: async () => {},
    unassignPlayerFromTrainingBlock: async () => {},
});
