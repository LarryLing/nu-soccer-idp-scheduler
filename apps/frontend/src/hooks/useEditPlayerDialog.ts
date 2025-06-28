import { useContext } from "react";
import type { EditPlayerDialogContextType } from "../utils/types.ts";
import { EditPlayerDialogContext } from "../contexts/EditPlayerDialogContext.tsx";

export const useEditPlayerDialog = (): EditPlayerDialogContextType => {
  const context = useContext(EditPlayerDialogContext);

  if (context === undefined) {
    throw new Error(
      "useEditPlayerDialog must be used within a EditPlayerDialogProvider",
    );
  }

  return context;
};
