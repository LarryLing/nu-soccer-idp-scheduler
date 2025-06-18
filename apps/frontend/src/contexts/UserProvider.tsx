import { type PropsWithChildren, useEffect, useState } from "react";
import type { User } from "../utils/types.ts";
import { UserContext } from "./UserContext.tsx";
import { clientAuth } from "../utils/firebase.ts";
import {
    confirmPasswordReset,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signInWithEmailAndPassword,
    signOut,
} from "firebase/auth";

export function UserProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const signUpUser = async (email?: string, password?: string) => {
        if (!email || !password) {
            throw new Error("Email and password required");
        }

        await createUserWithEmailAndPassword(clientAuth, email, password);
    };

    const signInUser = async (email?: string, password?: string) => {
        if (!email || !password) {
            throw new Error("Email and password required");
        }

        await signInWithEmailAndPassword(clientAuth, email, password);
    };

    const signOutUser = async () => {
        await signOut(clientAuth);
    };

    const requestPasswordReset = async (email?: string) => {
        if (!email) {
            throw new Error("Email required");
        }

        await sendPasswordResetEmail(clientAuth, email);
    };

    const resetPassword = async (actionCode?: string, newPassword?: string) => {
        if (!newPassword || !actionCode) {
            throw new Error("New password and action code required");
        }

        await confirmPasswordReset(clientAuth, actionCode, newPassword);
    };

    useEffect(() => {
        const unsubscribe = clientAuth.onAuthStateChanged((user) => {
            if (user) {
                setUser({
                    uid: user.uid,
                    email: user.email || "",
                });
            } else {
                setUser(null);
            }

            setIsLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const value = {
        user: user,
        isLoading: isLoading,
        signUp: signUpUser,
        signIn: signInUser,
        signOut: signOutUser,
        requestPasswordReset: requestPasswordReset,
        resetPassword: resetPassword,
    };

    return (
        <UserContext.Provider value={value}>
            {!isLoading && children}
        </UserContext.Provider>
    );
}
