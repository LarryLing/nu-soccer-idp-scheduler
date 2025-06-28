import { createContext } from "react";
import type { EditPlayerDialogContextType } from "../utils/types.ts";

export const EditPlayerDialogContext = createContext<
  EditPlayerDialogContextType | undefined
>(undefined);
