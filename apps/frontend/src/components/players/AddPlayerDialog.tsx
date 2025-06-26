import {
    Box,
    Button,
    Dialog,
    Flex,
    Select,
    Text,
    TextField,
} from "@radix-ui/themes";
import AvailabilityRow from "./AvailabilityRow.tsx";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { PlayerSchema } from "../../utils/schemas.ts";
import { z } from "zod";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { addDoc, collection } from "firebase/firestore";
import { clientFirestore } from "../../utils/firebase.ts";
import type { User } from "../../utils/types.ts";
import {
    DEFAULT_AVAILABILITY,
    DEFAULT_VALUES,
    POSITION_OPTIONS,
} from "../../utils/constants.ts";

type AddPlayerDialogProps = {
    user: User | null;
};

export default function AddPlayerDialog({ user }: AddPlayerDialogProps) {
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
        defaultValues: DEFAULT_VALUES,
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "availabilities",
    });

    const handleOpen = () => {
        reset(DEFAULT_VALUES);
        setIsOpen(true);
    };

    const handleClose = () => {
        clearErrors();
        setIsOpen(false);
    };

    const addAvailability = () => {
        append(DEFAULT_AVAILABILITY);
    };

    const onSubmit = () =>
        handleSubmit(async (data: z.infer<typeof PlayerSchema>) => {
            if (!user?.uid) {
                console.error("User not authenticated");
                return;
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
        });

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
                <form onSubmit={onSubmit}>
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
                                    <Select.Trigger
                                        style={{ width: "100%" }}
                                        id="position"
                                    />
                                    <Select.Content>
                                        {POSITION_OPTIONS.map(
                                            ({ value, label }) => (
                                                <Select.Item
                                                    key={value}
                                                    value={value}
                                                >
                                                    {label}
                                                </Select.Item>
                                            ),
                                        )}
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
                    <Box mb="3">
                        <Flex direction="column" gap="2">
                            <Flex justify="between" align="center">
                                <label>
                                    <Text size="2" weight="medium" as="p">
                                        Availabilities
                                    </Text>
                                </label>
                                <Button
                                    variant="soft"
                                    color="gray"
                                    type="button"
                                    onClick={addAvailability}
                                    disabled={isFormDisabled}
                                >
                                    Add Availability
                                </Button>
                            </Flex>
                            {fields.map((field, index) => (
                                <AvailabilityRow
                                    key={field.id}
                                    index={index}
                                    register={register}
                                    remove={remove}
                                    errors={errors}
                                    control={control}
                                />
                            ))}
                        </Flex>
                    </Box>
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
