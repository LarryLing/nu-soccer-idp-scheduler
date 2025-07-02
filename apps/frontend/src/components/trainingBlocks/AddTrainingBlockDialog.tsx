import { Button, Dialog, Select, TextField } from "@radix-ui/themes";
import { useForm, Controller, type SubmitHandler } from "react-hook-form";
import { TrainingBlockSchema } from "../../utils/schemas.ts";
import { z } from "zod";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection } from "firebase/firestore";
import { clientFirestore } from "../../utils/firebase.ts";
import type { TrainingBlock, User } from "../../utils/types.ts";
import { DAYS, DEFAULT_TRAINING_BLOCK } from "../../utils/constants.ts";
import { checkFormTrainingBlockOverlaps } from "../../utils/helpers.ts";
import FormField from "../miscellaneous/FormField.tsx";
import FormActions from "../miscellaneous/FormActions.tsx";

type AddTrainingBlockDialogProps = {
  user: User | null;
  trainingBlocks: TrainingBlock[];
};

type FormData = z.infer<typeof TrainingBlockSchema>;

export default function AddTrainingBlockDialog({
  user,
  trainingBlocks,
}: AddTrainingBlockDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    clearErrors,
    formState: { isSubmitting, isValidating, errors },
  } = useForm<FormData>({
    defaultValues: DEFAULT_TRAINING_BLOCK,
    resolver: zodResolver(TrainingBlockSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const handleOpen = () => {
    reset();
    setIsOpen(true);
  };

  const handleClose = () => {
    clearErrors();
    setIsOpen(false);
  };

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

    setIsAdding(true);

    try {
      await addDoc(
        collection(clientFirestore, `users/${user.uid}/trainingBlocks`),
        {
          ...data,
          assignedPlayers: [],
          createdAt: Date.now(),
        },
      );
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to add training block:", error);
      setError("day", {
        type: "manual",
        message: "An unexpected error occurred",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const isFormDisabled = isSubmitting || isValidating || isAdding;

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger>
        <Button onClick={handleOpen}>
          <PlusIcon size={15} />
          Add Training Block
        </Button>
      </Dialog.Trigger>
      <Dialog.Content width="350px">
        <Dialog.Title>Add Training Block</Dialog.Title>
        <Dialog.Description mb="3">
          Insert training block information
        </Dialog.Description>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormField label="Day" id="day" error={errors.day?.message}>
            <Controller
              name="day"
              control={control}
              render={({ field }) => (
                <Select.Root
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isFormDisabled}
                >
                  <Select.Trigger style={{ width: "100%" }} id="day" />
                  <Select.Content>
                    {DAYS.map((day) => (
                      <Select.Item key={day} value={day}>
                        {day}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              )}
            />
          </FormField>
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
            isPerformingAction={isAdding}
            onCancel={handleClose}
          />
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
