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
import { useForm, useFieldArray } from "react-hook-form";
import { PlayerSchema } from "../../utils/schemas.ts";
import { z } from "zod";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";

type AddPlayerDialogProps = {
    addPlayer: (player: z.infer<typeof PlayerSchema>) => void;
};

export default function PlayerDialog({ addPlayer }: AddPlayerDialogProps) {
    const [isOpen, setIsOpen] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { isSubmitSuccessful, isSubmitting, isValidating, errors },
    } = useForm<z.infer<typeof PlayerSchema>>({
        resolver: zodResolver(PlayerSchema),
        defaultValues: {
            name: "",
            number: 0,
            position: "Goalkeeper",
            availabilities: [
                {
                    day: "Monday",
                    start: "9:30AM",
                    end: "10:00AM",
                },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray<
        z.infer<typeof PlayerSchema>
    >({
        control,
        name: "availabilities",
    });

    useEffect(() => {
        if (isSubmitSuccessful) {
            setIsOpen(false);
            reset();
        }
    }, [isSubmitSuccessful, reset]);

    const onSubmit = handleSubmit((data) => {
        addPlayer(data);
    });

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger>
                <Button>
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
                            {...register("name")}
                        />
                        {errors?.name && (
                            <>
                                <Text
                                    size="2"
                                    weight="regular"
                                    as="p"
                                    color="red"
                                >
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
                        <Select.Root
                            defaultValue="Goalkeeper"
                            {...register("position")}
                        >
                            <Select.Trigger
                                style={{ width: "100%" }}
                                id="position"
                                name="position"
                            />
                            <Select.Content>
                                <Select.Item value="Goalkeeper">
                                    Goalkeeper
                                </Select.Item>
                                <Select.Item value="Defender">
                                    Defender
                                </Select.Item>
                                <Select.Item value="Midfielder">
                                    Midfielder
                                </Select.Item>
                                <Select.Item value="Forward">
                                    Forward
                                </Select.Item>
                            </Select.Content>
                        </Select.Root>
                        {errors?.position && (
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
                                    onClick={() =>
                                        append({
                                            day: "Monday",
                                            start: "9:30AM",
                                            end: "10:00AM",
                                        })
                                    }
                                >
                                    Add Availability
                                </Button>
                            </Flex>
                            {fields.map((field, index) => {
                                return (
                                    <AvailabilityRow
                                        key={field.id}
                                        index={index}
                                        register={register}
                                        remove={remove}
                                        errors={errors}
                                    />
                                );
                            })}
                        </Flex>
                    </Box>
                    <Flex direction="row-reverse" gap="4">
                        <Button
                            type="submit"
                            disabled={isSubmitting || isValidating}
                        >
                            Add Player
                        </Button>
                        <Dialog.Close>
                            <Button
                                variant="soft"
                                type="button"
                                disabled={isSubmitting || isValidating}
                            >
                                Cancel
                            </Button>
                        </Dialog.Close>
                    </Flex>
                </form>
            </Dialog.Content>
        </Dialog.Root>
    );
}
