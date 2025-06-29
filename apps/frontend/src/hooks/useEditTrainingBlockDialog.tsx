import {
  Box,
  Button,
  Dialog,
  Flex,
  Select,
  Text,
  TextField,
} from "@radix-ui/themes";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { doc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useUser } from "./useUser.ts";
import type { TrainingBlock } from "../utils/types.ts";
import { clientFirestore } from "../utils/firebase.ts";
import { DAYS } from "../utils/constants.ts";
import { TrainingBlockSchema } from "../utils/schemas.ts";

export const useEditTrainingBlockDialog = () => {
  const { user } = useUser();

  const [trainingBlockId, setTrainingBlockId] =
    useState<TrainingBlock["id"]>("");
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    setError,
    clearErrors,
    formState: { isSubmitting, isValidating, errors },
  } = useForm<z.infer<typeof TrainingBlockSchema>>({
    resolver: zodResolver(TrainingBlockSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const isFormDisabled = isSubmitting || isValidating || isSaving;

  const handleOpen = (trainingBlock: TrainingBlock) => {
    reset({
      day: trainingBlock.day,
      start: trainingBlock.start,
      end: trainingBlock.end,
    });
    setTrainingBlockId(trainingBlock.id);
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

    // for (const day of DAYS) {
    //   const filteredData = data.availabilities
    //     .filter((availability) => {
    //       return availability.day === day;
    //     })
    //     .sort((a, b) => {
    //       return parseTime(a.start) - parseTime(b.start);
    //     });
    //
    //   if (filteredData.length === 0) {
    //     continue;
    //   }
    //
    //   const hasOverlaps = filteredData.some((current, index) => {
    //     if (index === 0) return false;
    //     const previous = filteredData[index - 1];
    //     return parseTime(current.start) <= parseTime(previous.end);
    //   });
    //
    //   if (hasOverlaps) {
    //     console.error("Overlapping or redundant availabilities were found");
    //     setError("root.availabilities", {
    //       type: "manual",
    //       message: "Please fix the overlapping or redundant availabilities.",
    //     });
    //     return;
    //   }
    // }

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

  const EditTrainingBlockDialog = () => {
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
  };

  return {
    EditTrainingBlockDialog,
    handleOpen,
  };
};
