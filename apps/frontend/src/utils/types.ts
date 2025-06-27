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
  UseFieldArrayRemove,
  UseFormHandleSubmit,
  UseFormRegister,
  UseFormSetError,
} from "react-hook-form";
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
};

export type EditPlayerDialogContextType = {
  playerId: Player["id"];
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  register: UseFormRegister<z.infer<typeof PlayerSchema>>;
  control: Control<z.infer<typeof PlayerSchema>>;
  isSubmitting: boolean;
  isSaving: boolean;
  setIsSaving: (isSaving: boolean) => void;
  isValidating: boolean;
  errors: FormState<z.infer<typeof PlayerSchema>>["errors"];
  setError: UseFormSetError<z.infer<typeof PlayerSchema>>;
  fields: FieldArrayWithId<z.infer<typeof PlayerSchema>>[];
  remove: UseFieldArrayRemove;
  handleOpen: (player: Player) => void;
  handleClose: () => void;
  addAvailability: (day: Availability["day"]) => void;
  handleSubmit: UseFormHandleSubmit<z.infer<typeof PlayerSchema>>;
};
