import {
  Box,
  Button,
  Dialog,
  Flex,
  Select,
  Text,
  TextField,
} from "@radix-ui/themes";
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
import { parseTime } from "../../utils/helpers.ts";

type AddTrainingBlockDialogProps = {
  user: User | null;
  trainingBlocks: TrainingBlock[];
};

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
  } = useForm<z.infer<typeof TrainingBlockSchema>>({
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

    const hasOverlaps = filteredTrainingBlocks.some((current) => {
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
              {isAdding ? "Adding..." : "Add Training Block"}
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
