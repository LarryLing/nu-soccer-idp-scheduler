import { useEffect, useState, type ReactNode, type ReactElement } from "react";
import type { User, UserContextType } from "../utils/types.ts";
import { UserContext } from "./user-context.tsx";
import { clientAuth } from "../utils/firebase.ts";
import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";

interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps): ReactElement {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const buildUrl = (endpoint: string): string =>
    `http://localhost:3000${endpoint}`;
  // `${import.meta.env.VITE_BACKEND_URL?.replace(/\/$/, '')}${endpoint}`;

  const loadUser = async (): Promise<void> => {
    await checkAuth();
  };

  const checkAuth = async (): Promise<boolean> => {
    try {
      const currentUser = clientAuth.currentUser;
      if (!currentUser) {
        return false;
      }

      const idToken = await currentUser.getIdToken();

      const response = await fetch("api/auth/check", {
        headers: {
          authorization: `Bearer ${idToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("User not found, must reauthenticate");
      }

      const data = await response.json();
      setUser({
        uid: data.uid,
        email: data.email,
      });
      setIsAuthenticated(true);
      return true;
    } catch {
      setUser(null);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signin = async (email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await signInWithEmailAndPassword(
        clientAuth,
        email,
        password,
      );
      const idToken = await userCredential.user.getIdToken();

      const response = await fetch("api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      if (!response.ok) {
        throw new Error("Auth check failed");
      }

      const data = await response.json();

      setUser({
        uid: data.uid,
        email: data.email,
      });
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Signin error:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signout = async (): Promise<void> => {
    try {
      await signOut(clientAuth);
      const uid = clientAuth.currentUser?.uid;

      await fetch("/api/auth/signout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid }),
      });
    } catch (error) {
      console.error("Signout error:", error);
    }
  };

  const requestPasswordReset = async (email: string) => {
    try {
      await sendPasswordResetEmail(clientAuth, email);
      return true;
    } catch (error) {
      console.error("Password reset error:", error);
      return false;
    }
  };

  const updatePassword = async (
    password: string,
    accessToken: string,
  ): Promise<boolean> => {
    try {
      const response = await fetch(buildUrl("/auth/reset-password"), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Password update failed");
      }

      return true;
    } catch (error) {
      console.error("Password update error:", error);
      throw error;
    }
  };

  useEffect(() => {
    const initialize = async () => {
      await loadUser();
    };
    initialize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contextValue: UserContextType = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    signin,
    signout,
    loadUser,
    checkAuth,
    requestPasswordReset,
    updatePassword,
  };

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
}
