import {
    Box,
    Button,
    Dialog,
    Flex,
    Text,
    TextField,
    Select,
} from "@radix-ui/themes";
import { PlusIcon } from "lucide-react";
import type {
    Availability,
    Player,
    PlayerDialogFormState,
} from "../../utils/types.ts";
import { useState } from "react";
import AvailabilityRow from "./AvailabilityRow.tsx";
import {
    PlayerSchema,
    type PlayerSchema as PlayerSchemaType,
} from "../../utils/schemas.ts";
import { z } from "zod";
import { useFirestore } from "../../hooks/useFirestore.ts";
import { FirebaseError } from "firebase/app";

export default function AddPlayerDialog() {
    const { addPlayer } = useFirestore();
    const [playerData, setPlayerData] = useState<
        z.infer<typeof PlayerSchemaType>
    >({
        name: "",
        number: 0,
        position: "Goalkeeper",
        availabilities: [],
    });

    const [isOpen, setIsOpen] = useState(false);
    const [state, setState] = useState<PlayerDialogFormState>(null);
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async () => {
        setIsPending(true);

        const result = PlayerSchema.safeParse(playerData);

        if (!result.success) {
            setState({ errors: result.error.flatten().fieldErrors });
            setIsPending(false);
            return;
        }

        try {
            await addPlayer(playerData);
            handleClose();
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error(error);
            }
        } finally {
            setIsPending(false);
        }
    };

    const handleClose = () => {
        setIsOpen(false);
        setState(null);
        setPlayerData({
            name: "",
            number: 0,
            position: "Goalkeeper",
            availabilities: [],
        });
    };

    const handleAddAvailability = () => {
        setPlayerData({
            ...playerData,
            availabilities: [
                ...playerData.availabilities,
                { day: "Monday", start: "9:30AM", end: "10:00AM" },
            ],
        });
    };

    const handleRemoveAvailability = (index: number) => {
        const availabilities = [...playerData.availabilities];
        availabilities.splice(index, 1);
        setPlayerData({
            ...playerData,
            availabilities,
        });
    };

    const handleEditAvailability = (
        index: number,
        field: "day" | "start" | "end",
        value:
            | Availability["day"]
            | Availability["start"]
            | Availability["end"],
    ) => {
        const availabilities = [...playerData.availabilities];
        availabilities[index] = {
            ...availabilities[index],
            [field]: value,
        };
        setPlayerData({
            ...playerData,
            availabilities,
        });
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Trigger>
                <Button onClick={() => setIsOpen(true)}>
                    <PlusIcon size={15} />
                    Add Player
                </Button>
            </Dialog.Trigger>
            <Dialog.Content>
                <Dialog.Title>Add Player</Dialog.Title>
                <Dialog.Description mb="5">
                    Insert player information.
                </Dialog.Description>
                <Box mb="5">
                    <label htmlFor="name">
                        <Text size="2" weight="medium" mb="1" as="p">
                            Name
                        </Text>
                    </label>
                    <TextField.Root
                        id="name"
                        name="name"
                        placeholder="Enter player name"
                        value={playerData.name}
                        onChange={(e) =>
                            setPlayerData({
                                ...playerData,
                                name: e.target.value,
                            })
                        }
                    />
                    {state?.errors?.name && (
                        <>
                            <Text size="2" weight="regular" as="p" color="red">
                                Name must:
                            </Text>
                            {state.errors.name.map((value) => (
                                <Text
                                    key={value}
                                    size="2"
                                    weight="regular"
                                    as="p"
                                    color="red"
                                >
                                    - {value}
                                </Text>
                            ))}
                        </>
                    )}
                </Box>
                <Flex justify="between" mb="5" gap="4">
                    <Box width="100%">
                        <label htmlFor="number">
                            <Text size="2" weight="medium" mb="1" as="p">
                                Number
                            </Text>
                        </label>
                        <TextField.Root
                            id="number"
                            name="number"
                            type="number"
                            placeholder="Enter player number"
                            value={playerData.number}
                            onChange={(e) =>
                                setPlayerData({
                                    ...playerData,
                                    number: parseInt(e.target.value),
                                })
                            }
                            min="0"
                            max="99"
                            step="1"
                            inputMode="numeric"
                        />
                        {state?.errors?.number && (
                            <Text size="2" weight="regular" as="p" color="red">
                                {state.errors.number}
                            </Text>
                        )}
                    </Box>
                    <Box width="100%">
                        <label htmlFor="position">
                            <Text size="2" weight="medium" mb="1" as="p">
                                Position
                            </Text>
                        </label>
                        <Select.Root
                            defaultValue="Goalkeeper"
                            name="position"
                            value={playerData.position}
                            onValueChange={(value) =>
                                setPlayerData({
                                    ...playerData,
                                    position: value as Player["position"],
                                })
                            }
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
                        {state?.errors?.position && (
                            <Text size="2" weight="regular" as="p" color="red">
                                {state.errors.position}
                            </Text>
                        )}
                    </Box>
                </Flex>
                <Box mb="5">
                    <Flex direction="column" gap="2">
                        <Flex justify="between" align="center">
                            <label>
                                <Text size="2" weight="medium" as="p">
                                    Availabilities
                                </Text>
                            </label>
                            <Button
                                variant="outline"
                                color="gray"
                                onClick={handleAddAvailability}
                                type="button"
                            >
                                Add Availability
                            </Button>
                        </Flex>
                        {playerData.availabilities.map(
                            (availability, index) => (
                                <AvailabilityRow
                                    key={index}
                                    index={index}
                                    availability={availability}
                                    handleRemoveAvailability={
                                        handleRemoveAvailability
                                    }
                                    handleEditAvailability={
                                        handleEditAvailability
                                    }
                                />
                            ),
                        )}
                    </Flex>
                    {state?.errors?.availabilities && (
                        <>
                            <Text size="2" weight="regular" as="p" color="red">
                                Please fix the following errors:
                            </Text>
                            {state.errors.availabilities.map((value) => (
                                <Text
                                    key={value}
                                    size="2"
                                    weight="regular"
                                    as="p"
                                    color="red"
                                >
                                    - {value}
                                </Text>
                            ))}
                        </>
                    )}
                </Box>
                <Flex direction="row-reverse" gap="4">
                    <Button
                        type="submit"
                        disabled={isPending}
                        onClick={handleSubmit}
                    >
                        Add Player
                    </Button>
                    <Button
                        variant="soft"
                        type="button"
                        disabled={isPending}
                        onClick={handleClose}
                    >
                        Cancel
                    </Button>
                </Flex>
            </Dialog.Content>
        </Dialog.Root>
    );
}
