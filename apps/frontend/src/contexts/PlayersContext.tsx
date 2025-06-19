import { createContext } from "react";
import type { PlayersContextType } from "../utils/types.ts";

export const PlayersContext = createContext<PlayersContextType>({
    players: [],
    isLoading: false,
    addPlayer: () => {},
    removePlayer: () => {},
    removePlayers: () => {},
});
