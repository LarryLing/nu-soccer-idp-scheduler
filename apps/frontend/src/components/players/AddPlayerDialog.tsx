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
  useForm,
  useFieldArray,
  Controller,
  type SubmitHandler,
} from "react-hook-form";
import { PlayerSchema } from "../../utils/schemas.ts";
import { z } from "zod";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection } from "firebase/firestore";
import { clientFirestore } from "../../utils/firebase.ts";
import type { Availability, Player, User } from "../../utils/types.ts";
import {
  DAYS,
  DEFAULT_PLAYER,
  POSITION_OPTIONS,
} from "../../utils/constants.ts";
import { AvailabilityInputBox } from "./AvailabilityInputBox.tsx";
import { generateNextTimes, parseTime } from "../../utils/helpers.ts";

type AddPlayerDialogProps = {
  user: User | null;
  players: Player[];
};

export default function AddPlayerDialog({
  user,
  players,
}: AddPlayerDialogProps) {
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
  } = useForm<z.infer<typeof PlayerSchema>>({
    resolver: zodResolver(PlayerSchema),
    defaultValues: DEFAULT_PLAYER,
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "availabilities",
  });

  const handleOpen = () => {
    reset();
    setIsOpen(true);
  };

  const handleClose = () => {
    clearErrors();
    setIsOpen(false);
  };

  const addAvailability = (day: Availability["day"]) => {
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
    console.log(nextStartTime, nextEndTime);

    append({
      day: day,
      start: nextStartTime,
      end: nextEndTime,
    });
  };

  const onSubmit: SubmitHandler<z.infer<typeof PlayerSchema>> = async (
    data,
  ) => {
    if (!user?.uid) {
      console.error("User not authenticated");
      return;
    }

    if (players.some((player) => player.name === data.name)) {
      console.error("Player name already in use");
      setError("name", {
        type: "manual",
        message: "Player name already in use.",
      });
      return;
    }

    if (players.some((player) => player.number === data.number)) {
      console.error("Player number already in use");
      setError("number", {
        type: "manual",
        message: "Player number already in use.",
      });
      return;
    }

    for (const day of DAYS) {
      const filteredData = data.availabilities
        .filter((availability) => {
          return availability.day === day;
        })
        .sort((a, b) => {
          return parseTime(a.start) - parseTime(b.start);
        });

      if (filteredData.length === 0) {
        continue;
      }

      const hasOverlaps = filteredData.some((current, index) => {
        if (index === 0) return false;
        const previous = filteredData[index - 1];
        return parseTime(current.start) <= parseTime(previous.end);
      });

      if (hasOverlaps) {
        console.error("Overlapping or redundant availabilities were found");
        setError("root.availabilities", {
          type: "manual",
          message: "Please fix the overlapping or redundant availabilities.",
        });
        return;
      }
    }

    setIsAdding(true);

    try {
      await addDoc(
        collection(clientFirestore, `users/${user.uid}/players`),
        data,
      );
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to add player:", error);
      setError("name", {
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
          Add Player
        </Button>
      </Dialog.Trigger>
      <Dialog.Content width="450px">
        <Dialog.Title>Add Player</Dialog.Title>
        <Dialog.Description mb="3">
          Insert player information
        </Dialog.Description>
        <form
          onSubmit={(e) => {
            console.log("Form submit event triggered");
            handleSubmit(onSubmit)(e);
          }}
        >
          <Box mb="3">
            <label htmlFor="name">
              <Text size="2" weight="medium" mb="1" as="p">
                Name
              </Text>
            </label>
            <TextField.Root
              id="name"
              placeholder="Enter player name"
              disabled={isFormDisabled}
              {...register("name")}
            />
            {errors.name && (
              <Text size="2" weight="regular" as="p" color="red">
                {errors.name.message}
              </Text>
            )}
          </Box>
          <Box mb="3">
            <label htmlFor="number">
              <Text size="2" weight="medium" mb="1" as="p">
                Number
              </Text>
            </label>
            <TextField.Root
              id="number"
              type="number"
              placeholder="Enter player number"
              min="0"
              max="99"
              step="1"
              inputMode="numeric"
              disabled={isFormDisabled}
              {...register("number", {
                valueAsNumber: true,
              })}
            />
            {errors.number && (
              <Text size="2" weight="regular" as="p" color="red">
                {errors.number.message}
              </Text>
            )}
          </Box>
          <Box mb="3">
            <label htmlFor="position">
              <Text size="2" weight="medium" mb="1" as="p">
                Position
              </Text>
            </label>
            <Controller
              name="position"
              control={control}
              render={({ field }) => (
                <Select.Root
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isFormDisabled}
                >
                  <Select.Trigger style={{ width: "100%" }} id="position" />
                  <Select.Content>
                    {POSITION_OPTIONS.map((position) => (
                      <Select.Item key={position} value={position}>
                        {position}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              )}
            />
            {errors.position && (
              <Text size="2" weight="regular" as="p" color="red">
                {errors.position.message}
              </Text>
            )}
          </Box>
          <AvailabilityInputBox
            addAvailability={addAvailability}
            fields={fields}
            remove={remove}
            errors={errors}
            isFormDisabled={isFormDisabled}
            register={register}
          />
          <Flex direction="row-reverse" gap="2">
            <Button type="submit" disabled={isFormDisabled}>
              {isAdding ? "Adding..." : "Add Player"}
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
