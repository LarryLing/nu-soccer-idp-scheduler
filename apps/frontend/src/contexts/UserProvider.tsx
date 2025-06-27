import {
  type PropsWithChildren,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { User } from "../utils/types.ts";
import { UserContext } from "./UserContext.tsx";
import { clientAuth } from "../utils/firebase.ts";
import { type User as FirebaseUser } from "firebase/auth";

export function UserProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const transformFirebaseUser = useCallback(
    (firebaseUser: FirebaseUser | null): User | null => {
      if (!firebaseUser) return null;

      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email || "",
      };
    },
    [],
  );

  useEffect(() => {
    return clientAuth.onAuthStateChanged((firebaseUser) => {
      setUser(transformFirebaseUser(firebaseUser));
      setIsLoading(false);
    });
  }, [transformFirebaseUser]);

  const value = useMemo(
    () => ({
      user,
      isLoading,
    }),
    [user, isLoading],
  );

  return (
    <UserContext.Provider value={value}>
      {!isLoading && children}
    </UserContext.Provider>
  );
}
