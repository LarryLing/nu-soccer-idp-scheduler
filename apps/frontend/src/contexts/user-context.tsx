import { createContext } from "react";
import type { UserContextType } from "../utils/types.ts";

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  isLoading: false,
  isAuthenticated: false,
  signin: async () => false,
  signout: async () => {},
  loadUser: async () => {},
  checkAuth: async () => false,
  requestPasswordReset: async () => false,
  updatePassword: async () => false,
});
