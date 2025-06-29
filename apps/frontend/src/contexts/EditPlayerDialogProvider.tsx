import { type PropsWithChildren, useCallback, useMemo, useState } from "react";
import { EditPlayerDialogContext } from "./EditPlayerDialogContext.tsx";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { PlayerSchema } from "../utils/schemas.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Availability, Player } from "../utils/types.ts";
import { DEFAULT_PLAYER } from "../utils/constants.ts";
import { generateNextTimes, parseTime } from "../utils/helpers.ts";

export function EditPlayerDialogProvider({ children }: PropsWithChildren) {
  const [isOpen, setIsOpen] = useState(false);
  const [playerId, setPlayerId] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    setError,
    clearErrors,
    reset,
    formState: { isSubmitting, isValidating, errors },
  } = useForm<z.infer<typeof PlayerSchema>>({
    resolver: zodResolver(PlayerSchema),
    defaultValues: DEFAULT_PLAYER,
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const { fields, append, remove } = useFieldArray<
    z.infer<typeof PlayerSchema>
  >({
    control,
    name: "availabilities",
  });

  const handleOpen = useCallback(
    (player: Player) => {
      reset({
        name: player.name,
        number: player.number,
        position: player.position,
        availabilities: player.availabilities,
      });
      setPlayerId(player.id);
      setIsOpen(true);
    },
    [reset],
  );

  const handleClose = useCallback(() => {
    clearErrors();
    setIsOpen(false);
  }, [clearErrors]);

  const addAvailability = useCallback(
    (day: Availability["day"]) => {
      const availabilitiesForDay = fields
        .filter((field) => {
          return field.day === day;
        })
        .sort((a, b) => {
          return parseTime(a.start) - parseTime(b.start);
        });

      if (availabilitiesForDay.length === 0) {
        append({
          day: day,
          start: "8:00AM",
          end: "9:00AM",
        });
        return;
      }

      const lastEndTime =
        availabilitiesForDay[availabilitiesForDay.length - 1].end;

      const [nextStartTime, nextEndTime] = generateNextTimes(lastEndTime);

      append({
        day: day,
        start: nextStartTime,
        end: nextEndTime,
      });
    },
    [append, fields],
  );

  const value = useMemo(
    () => ({
      playerId,
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
      fields,
      remove,
      handleOpen,
      handleClose,
      addAvailability,
      handleSubmit,
    }),
    [
      playerId,
      isOpen,
      register,
      control,
      isSubmitting,
      isSaving,
      setIsSaving,
      isValidating,
      setError,
      errors,
      fields,
      remove,
      handleOpen,
      handleClose,
      addAvailability,
      handleSubmit,
    ],
  );

  return (
    <EditPlayerDialogContext.Provider value={value}>
      {children}
    </EditPlayerDialogContext.Provider>
  );
}
