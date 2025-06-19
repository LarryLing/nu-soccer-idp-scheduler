import { z } from "zod";
import {
    AvailabilitySchema,
    PlayerSchema,
    TrainingBlockSchema,
} from "./schemas.ts";

export type User = {
    uid: string;
    email: string;
};

export type Player = {
    id: string;
} & z.infer<typeof PlayerSchema>;

export type Availability = z.infer<typeof AvailabilitySchema>;

export type TrainingBlock = z.infer<typeof TrainingBlockSchema> & {
    id: string;
    assignedPlayers: Player[];
};

export type UserContextType = {
    user: User | null;
    isLoading: boolean;
    signUp: (email?: string, password?: string) => Promise<void>;
    signIn: (email?: string, password?: string) => Promise<void>;
    signOut: () => Promise<void>;
    requestPasswordReset: (email?: string) => Promise<void>;
    resetPassword: (actionCode?: string, newPassword?: string) => Promise<void>;
};

export type FirestoreContextType = {
    players: Player[];
    trainingBlocks: TrainingBlock[];
    isLoading: boolean;
    addPlayer: (player?: Player) => void;
    removePlayer: (playerId?: string) => void;
    removePlayers: (playerIds?: string[]) => void;
    addTrainingBlock: (trainingBlock?: TrainingBlock) => void;
    removeTrainingBlock: (trainingBlockId?: string) => void;
    assignPlayerToTrainingBlock: (
        trainingBlockId?: string,
        playerId?: string,
    ) => void;
    unassignPlayerFromTrainingBlock: (
        trainingBlockId?: string,
        playerId?: string,
    ) => void;
};

export type AuthFormState = {
    errors?: {
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
    };
} | null;
