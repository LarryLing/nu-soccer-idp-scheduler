import { createContext } from "react";
import type { UserContextType } from "../utils/types.ts";

export const UserContext = createContext<UserContextType>({
    user: null,
    isLoading: false,
    signUp: async () => {},
    signIn: async () => {},
    signOut: async () => {},
    requestPasswordReset: async () => {},
    resetPassword: async () => {},
});
