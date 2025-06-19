import { z } from "zod";
import { AvailabilitySchema, PlayerSchema } from "./schemas.ts";

export type User = {
    uid: string;
    email: string;
};

export type Player = {
    id: string;
} & z.infer<typeof PlayerSchema>;

export type Availability = z.infer<typeof AvailabilitySchema>;

export type UserContextType = {
    user: User | null;
    isLoading: boolean;
    signUp: (email?: string, password?: string) => Promise<void>;
    signIn: (email?: string, password?: string) => Promise<void>;
    signOut: () => Promise<void>;
    requestPasswordReset: (email?: string) => Promise<void>;
    resetPassword: (actionCode?: string, newPassword?: string) => Promise<void>;
};

export type PlayersContextType = {
    players: Player[];
    isLoading: boolean;
    addPlayer: (player?: Player) => void;
    removePlayer: (playerId?: string) => void;
    removePlayers: (playerIds?: string[]) => void;
};

export type AuthFormState = {
    errors?: {
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
    };
} | null;
