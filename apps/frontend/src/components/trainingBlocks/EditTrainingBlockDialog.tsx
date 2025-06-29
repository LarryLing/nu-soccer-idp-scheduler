import {
  Box,
  Button,
  Dialog,
  Flex,
  Select,
  Text,
  TextField,
} from "@radix-ui/themes";
import {
  type Control,
  Controller,
  type FormState,
  type SubmitHandler,
  type UseFormHandleSubmit,
  type UseFormRegister,
  type UseFormSetError,
} from "react-hook-form";
import { DAYS } from "../../utils/constants.ts";
import { z } from "zod";
import { TrainingBlockSchema } from "../../utils/schemas.ts";
import { useUser } from "../../hooks/useUser.ts";
import { parseTime } from "../../utils/helpers.ts";
import { doc, updateDoc } from "firebase/firestore";
import { clientFirestore } from "../../utils/firebase.ts";
import type { TrainingBlock } from "../../utils/types.ts";

type EditTrainingBlockDialogProps = {
  trainingBlockId: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  register: UseFormRegister<z.infer<typeof TrainingBlockSchema>>;
  control: Control<z.infer<typeof TrainingBlockSchema>>;
  isSubmitting: boolean;
  isSaving: boolean;
  setIsSaving: (isSaving: boolean) => void;
  isValidating: boolean;
  setError: UseFormSetError<z.infer<typeof TrainingBlockSchema>>;
  errors: FormState<z.infer<typeof TrainingBlockSchema>>["errors"];
  handleClose: () => void;
  handleSubmit: UseFormHandleSubmit<z.infer<typeof TrainingBlockSchema>>;
  trainingBlocks: TrainingBlock[];
};

export default function EditTrainingBlockDialog({
  trainingBlockId,
  isOpen,
  setIsOpen,
  register,
  control,
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

  const onSubmit: SubmitHandler<z.infer<typeof TrainingBlockSchema>> = async (
    data,
  ) => {
    if (!user?.uid) {
      console.error("User not authenticated");
      return;
    }

    const filteredTrainingBlocks = trainingBlocks
      .filter((trainingBlock) => {
        return trainingBlock.day === data.day;
      })
      .sort((a, b) => {
        return parseTime(a.start) - parseTime(b.start);
      });

    const hasOverlaps = filteredTrainingBlocks.some((current, index) => {
      if (index === 0) return false;
      if (current.id === trainingBlockId) return false;
      return parseTime(data.start) <= parseTime(current.end);
    });

    if (hasOverlaps) {
      console.error("Current training block overlaps with an existing one.");
      setError("start", {
        type: "manual",
        message: "Current training block overlaps with an existing one.",
      });
      return;
    }

    setIsSaving(true);

    try {
      await updateDoc(
        doc(
          clientFirestore,
          `users/${user.uid}/trainingBlocks/${trainingBlockId}`,
        ),
        data,
      );
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
        <form
          onSubmit={(e) => {
            console.log("Form submit event triggered");
            handleSubmit(onSubmit)(e);
          }}
        >
          <Box mb="3">
            <label htmlFor="day">
              <Text size="2" weight="medium" mb="1" as="p">
                Day
              </Text>
            </label>
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
                    {DAYS.map((position) => (
                      <Select.Item key={position} value={position}>
                        {position}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              )}
            />
            {errors.day && (
              <Text size="2" weight="regular" as="p" color="red">
                {errors.day.message}
              </Text>
            )}
          </Box>
          <Box mb="3">
            <label htmlFor="start">
              <Text size="2" weight="medium" mb="1" as="p">
                Start
              </Text>
            </label>
            <TextField.Root
              id="start"
              placeholder="9:30AM"
              disabled={isFormDisabled}
              {...register("start")}
            />
            {errors.start && (
              <Text size="2" weight="regular" as="p" color="red">
                {errors.start.message}
              </Text>
            )}
          </Box>
          <Box mb="3">
            <label htmlFor="end">
              <Text size="2" weight="medium" mb="1" as="p">
                End
              </Text>
            </label>
            <TextField.Root
              id="end"
              placeholder="10:30AM"
              disabled={isFormDisabled}
              {...register("end")}
            />
            {errors.end && (
              <Text size="2" weight="regular" as="p" color="red">
                {errors.end.message}
              </Text>
            )}
          </Box>
          <Flex direction="row-reverse" gap="2">
            <Button type="submit" disabled={isFormDisabled}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              variant="soft"
              type="button"
              disabled={isFormDisabled}
              onClick={handleClose}
            >
              Cancel
            </Button>
          </Flex>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  );
}
