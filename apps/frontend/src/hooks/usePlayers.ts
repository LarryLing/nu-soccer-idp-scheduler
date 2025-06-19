import { PlayersContext } from "../contexts/PlayersContext.tsx";
import { useContext } from "react";

export const usePlayers = () => {
    const context = useContext(PlayersContext);

    if (context === undefined) {
        throw new Error("usePlayers must be used within a PlayersProvider");
    }

    return context;
};
