import { useForm } from "react-hook-form";
import { z } from "zod";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import type { TrainingBlock } from "../utils/types.ts";
import { DEFAULT_TRAINING_BLOCK } from "../utils/constants.ts";
import { TrainingBlockSchema } from "../utils/schemas.ts";

export const useEditTrainingBlockDialog = () => {
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
    defaultValues: DEFAULT_TRAINING_BLOCK,
    resolver: zodResolver(TrainingBlockSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

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
    setIsOpen(false);
    clearErrors();
  };

  return {
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
    handleOpen,
    handleClose,
    handleSubmit,
  };
};
