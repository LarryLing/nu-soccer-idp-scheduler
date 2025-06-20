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

export type PlayerDialogContextType = {
    isOpen: boolean;
    playerDialogContent: PlayerDialogContent;
    updatePlayer: (
        field: "name" | "number" | "position",
        value: Player["name"] | Player["number"] | Player["position"],
    ) => void;
    addAvailability: () => void;
    removeAvailabilityAtIndex: (index: number) => void;
    updateAvailabilityAtIndex: (
        index: number,
        field: "day" | "start" | "end",
        value:
            | Availability["day"]
            | Availability["start"]
            | Availability["end"],
    ) => void;
    openDialog: (config: PlayerDialogContent) => void;
    closeDialog: () => void;
};

export type PlayerDialogContent = {
    title: string;
    description: string;
    player: z.infer<typeof PlayerSchema>;
    onSubmit: () => void;
    submitText: string;
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
