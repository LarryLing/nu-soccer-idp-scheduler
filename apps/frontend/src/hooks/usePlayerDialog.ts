import { useContext } from "react";
import { PlayerDialogContext } from "../contexts/PlayerDialogContext.tsx";

export const usePlayerDialog = () => {
    const context = useContext(PlayerDialogContext);

    if (context === undefined) {
        throw new Error(
            "usePlayerDialog must be used within a PlayerDialogProvider",
        );
    }

    return context;
};
