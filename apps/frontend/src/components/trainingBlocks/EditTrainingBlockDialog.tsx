import { Dialog, TextField } from "@radix-ui/themes";
import {
  type FormState,
  type SubmitHandler,
  type UseFormHandleSubmit,
  type UseFormRegister,
  type UseFormSetError,
} from "react-hook-form";
import { z } from "zod";
import { TrainingBlockSchema } from "../../utils/schemas.ts";
import { useUser } from "../../hooks/useUser.ts";
import { checkFormTrainingBlockOverlaps } from "../../utils/helpers.ts";
import { doc, updateDoc } from "firebase/firestore";
import { clientFirestore } from "../../utils/firebase.ts";
import type { TrainingBlock } from "../../utils/types.ts";
import FormField from "../miscellaneous/FormField.tsx";
import FormActions from "../miscellaneous/FormActions.tsx";

type FormData = z.infer<typeof TrainingBlockSchema>;

type EditTrainingBlockDialogProps = {
  trainingBlockId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  register: UseFormRegister<FormData>;
  isSubmitting: boolean;
  isSaving: boolean;
  setIsSaving: (isSaving: boolean) => void;
  isValidating: boolean;
  setError: UseFormSetError<FormData>;
  errors: FormState<FormData>["errors"];
  handleClose: () => void;
  handleSubmit: UseFormHandleSubmit<FormData>;
  trainingBlocks: TrainingBlock[];
};

export default function EditTrainingBlockDialog({
  trainingBlockId,
  isOpen,
  setIsOpen,
  register,
  isSubmitting,
  isSaving,
  setIsSaving,
  isValidating,
  setError,
  errors,
  handleClose,
  handleSubmit,
  trainingBlocks,
}: EditTrainingBlockDialogProps) {
  const { user } = useUser();

  const isFormDisabled = isSubmitting || isValidating || isSaving;

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (!user?.uid) {
      console.error("User not authenticated");
      return;
    }

    if (checkFormTrainingBlockOverlaps(trainingBlocks, data)) {
      console.error("Current training block overlaps with an existing one.");
      setError("start", {
        type: "manual",
        message: "Current training block overlaps with an existing one.",
      });
      return;
    }

    setIsSaving(true);

    try {
      const trainingBlockDocRef = doc(
        clientFirestore,
        `users/${user.uid}/trainingBlocks/${trainingBlockId}`,
      );
      await updateDoc(trainingBlockDocRef, data);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to edit training block:", error);
      setError("day", {
        type: "manual",
        message: "An unexpected error occurred",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Content width="350px">
        <Dialog.Title>Edit Training Block</Dialog.Title>
        <Dialog.Description mb="3">
          Modify training block information
        </Dialog.Description>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField label="Start" id="start" error={errors.start?.message}>
            <TextField.Root
              id="start"
              placeholder="9:30AM"
              disabled={isFormDisabled}
              {...register("start")}
            />
          </FormField>
          <FormField label="End" id="end" error={errors.end?.message}>
            <TextField.Root
              id="end"
              placeholder="10:30AM"
              disabled={isFormDisabled}
              {...register("end")}
            />
          </FormField>
          <FormActions
            isDisabled={isFormDisabled}
            isPerformingAction={isSaving}
            onCancel={handleClose}
          />
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
