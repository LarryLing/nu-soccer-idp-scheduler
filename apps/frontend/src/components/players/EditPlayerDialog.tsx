import {
  Box,
  Button,
  Dialog,
  Flex,
  Select,
  Text,
  TextField,
} from "@radix-ui/themes";
import { Controller, type SubmitHandler } from "react-hook-form";
import type { EditPlayerDialogContextType, Player } from "../../utils/types.ts";
import { POSITION_OPTIONS } from "../../utils/constants.ts";
import { z } from "zod";
import { PlayerSchema } from "../../utils/schemas.ts";
import { doc, updateDoc } from "firebase/firestore";
import { clientFirestore } from "../../utils/firebase.ts";
import { useUser } from "../../hooks/useUser.ts";
import { AvailabilityInputBox } from "./AvailabilityInputBox.tsx";

type EditPlayerDialogProps = {
  players: Player[];
} & EditPlayerDialogContextType;

export default function EditPlayerDialog({
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
  handleClose,
  addAvailability,
  handleSubmit,
  players,
}: EditPlayerDialogProps) {
  const { user } = useUser();

  const isFormDisabled = isSubmitting || isValidating || isSaving;

  const onSubmit: SubmitHandler<z.infer<typeof PlayerSchema>> = async (
    data,
  ) => {
    if (!user?.uid) {
      console.error("User not authenticated");
      return;
    }

    if (
      players.some(
        (player) => player.name === data.name && player.id !== playerId,
      )
    ) {
      console.error("Player name already in use");
      setError("name", {
        type: "manual",
        message: "Player name already in use",
      });
      return;
    }

    if (
      players.some(
        (player) => player.number === data.number && player.id !== playerId,
      )
    ) {
      console.error("Player number already in use");
      setError("number", {
        type: "manual",
        message: "Player number already in use",
      });
      return;
    }

    setIsSaving(true);

    try {
      await updateDoc(
        doc(clientFirestore, `users/${user.uid}/players/${playerId}`),
        data,
      );
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to update player:", error);

      setError("name", {
        type: "manual",
        message: "An unexpected error occurred",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Content width="450px">
        <Dialog.Title>Edit Player</Dialog.Title>
        <Dialog.Description mb="3">
          Update player information
        </Dialog.Description>
        <form onSubmit={handleSubmit(onSubmit)}>
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
            {errors?.name && (
              <>
                <Text size="2" weight="regular" as="p" color="red">
                  {errors.name.message}
                </Text>
              </>
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
            {errors?.number && (
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
            {errors?.position && (
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
