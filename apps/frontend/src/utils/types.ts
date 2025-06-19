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
    addPlayer: (player?: z.infer<typeof PlayerSchema>) => Promise<void>;
    removePlayer: (playerId?: string) => Promise<void>;
    removePlayers: (playerIds?: string[]) => Promise<void>;
    addTrainingBlock: (
        trainingBlock?: z.infer<typeof TrainingBlockSchema>,
    ) => Promise<void>;
    removeTrainingBlock: (trainingBlockId?: string) => Promise<void>;
    assignPlayerToTrainingBlock: (
        trainingBlockId?: string,
        playerId?: string,
    ) => Promise<void>;
    unassignPlayerFromTrainingBlock: (
        trainingBlockId?: string,
        playerId?: string,
    ) => Promise<void>;
};

export type AuthFormState = {
    errors?: {
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
    };
} | null;

export type PlayerDialogFormState = {
    errors?: {
        name?: string[];
        number?: string[];
        position?: string[];
        availabilities?: string[];
    };
} | null;
