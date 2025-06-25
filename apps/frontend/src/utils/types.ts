import { z } from "zod";
import {
    AvailabilitySchema,
    PlayerSchema,
    TrainingBlockSchema,
} from "./schemas.ts";
import type {
    Control,
    FieldArrayWithId,
    FormState,
    UseFieldArrayAppend,
    UseFieldArrayRemove,
    UseFormRegister,
} from "react-hook-form";
import type { BaseSyntheticEvent } from "react";
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

export type EditPlayerDialogContextType = {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    register: UseFormRegister<z.infer<typeof PlayerSchema>>;
    control: Control<z.infer<typeof PlayerSchema>>;
    isSubmitting: boolean;
    isValidating: boolean;
    errors: FormState<z.infer<typeof PlayerSchema>>["errors"];
    fields: FieldArrayWithId<z.infer<typeof PlayerSchema>>[];
    append: UseFieldArrayAppend<z.infer<typeof PlayerSchema>>;
    remove: UseFieldArrayRemove;
    handleOpen: (player: Player) => void;
    handleClose: () => void;
    onSubmit: (e?: BaseSyntheticEvent) => Promise<void>;
};
