import { createContext } from "react";
import type { FirestoreContextType } from "../utils/types.ts";

export const FirestoreContext = createContext<FirestoreContextType>({
    players: [],
    trainingBlocks: [],
    isLoading: false,
    addPlayer: () => {},
    removePlayer: () => {},
    removePlayers: () => {},
    addTrainingBlock: () => {},
    removeTrainingBlock: () => {},
    assignPlayerToTrainingBlock: () => {},
    unassignPlayerFromTrainingBlock: () => {},
});
