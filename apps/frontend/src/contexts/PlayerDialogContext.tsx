import { createContext } from "react";
import type { PlayerDialogContextType } from "../utils/types.ts";

export const PlayerDialogContext = createContext<PlayerDialogContextType>({
    handleOpen: () => {},
    PlayerDialog: () => <></>,
});
