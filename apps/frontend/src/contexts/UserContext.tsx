import { createContext } from "react";
import type { UserContextType } from "../utils/types.ts";

export const UserContext = createContext<UserContextType | undefined>(
  undefined,
);
