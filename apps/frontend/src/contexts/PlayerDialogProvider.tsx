import {
    type ChangeEvent,
    type PropsWithChildren,
    useCallback,
    useState,
} from "react";
import {
    Box,
    Button,
    Dialog,
    Flex,
    Select,
    Text,
    TextField,
} from "@radix-ui/themes";
import type {
    Availability,
    Player,
    PlayerDialogFormState,
} from "../utils/types.ts";
import AvailabilityRow from "../components/players/AvailabilityRow.tsx";
import { useFirestore } from "../hooks/useFirestore.ts";
import { z } from "zod";
import {
    PlayerSchema,
    type PlayerSchema as PlayerSchemaType,
} from "../utils/schemas.ts";
import { FirebaseError } from "firebase/app";
import { PlayerDialogContext } from "./PlayerDialogContext.tsx";

export function PlayerDialogProvider({ children }: PropsWithChildren) {
    const { addPlayer } = useFirestore();

    const [playerDialogFormData, setPlayerDialogFormData] = useState<
        z.infer<typeof PlayerSchemaType>
    >({
        name: "",
        number: 0,
        position: "Goalkeeper",
        availabilities: [],
    });
    const [action, setAction] = useState<"add" | "edit">("add");
    const [isOpen, setIsOpen] = useState(false);
    const [state, setState] = useState<PlayerDialogFormState>(null);
    const [isPending, setIsPending] = useState(false);

    const handleSubmit = async () => {
        setIsPending(true);

        const result = PlayerSchema.safeParse(playerDialogFormData);

        if (!result.success) {
            setState({ errors: result.error.flatten().fieldErrors });
            setIsPending(false);
            return;
        }

        try {
            await addPlayer(playerDialogFormData);
            handleClose();
        } catch (error) {
            if (error instanceof FirebaseError) {
                console.error(error);
            }
        } finally {
            setIsPending(false);
        }
    };

    const handleOpen = useCallback(
        (presetPlayerData?: z.infer<typeof PlayerSchemaType>) => {
            if (presetPlayerData) {
                setAction("edit");
                setPlayerDialogFormData(presetPlayerData);
            } else {
                setAction("add");
                setPlayerDialogFormData({
                    name: "",
                    number: 0,
                    position: "Goalkeeper",
                    availabilities: [],
                });
            }

            setState(null);
            setIsOpen(true);
        },
        [],
    );

    const handleClose = useCallback(() => {
        setIsOpen(false);
    }, []);

    const handleNameChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) =>
            setPlayerDialogFormData({
                ...playerDialogFormData,
                name: e.target.value,
            }),
        [playerDialogFormData],
    );

    const handleNumberChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) =>
            setPlayerDialogFormData({
                ...playerDialogFormData,
                number: parseInt(e.target.value),
            }),
        [playerDialogFormData],
    );

    const handlePositionChange = useCallback(
        (value: string) =>
            setPlayerDialogFormData({
                ...playerDialogFormData,
                position: value as Player["position"],
            }),
        [playerDialogFormData],
    );

    const handleAddAvailability = useCallback(() => {
        setPlayerDialogFormData({
            ...playerDialogFormData,
            availabilities: [
                ...playerDialogFormData.availabilities,
                { day: "Monday", start: "9:30AM", end: "10:00AM" },
            ],
        });
    }, [playerDialogFormData]);

    const removeAvailabilityAtIndex = useCallback(
        (index: number) => {
            const availabilities = [...playerDialogFormData.availabilities];
            availabilities.splice(index, 1);
            setPlayerDialogFormData({
                ...playerDialogFormData,
                availabilities,
            });
        },
        [playerDialogFormData],
    );

    const updateAvailabilityDayAtIndex = useCallback(
        (index: number, value: string) => {
            const availabilities = [...playerDialogFormData.availabilities];
            availabilities[index] = {
                ...availabilities[index],
                day: value as Availability["day"],
            };
            setPlayerDialogFormData({
                ...playerDialogFormData,
                availabilities,
            });
        },
        [playerDialogFormData],
    );

    const updateAvailabilityStartAtIndex = useCallback(
        (index: number, value: string) => {
            const availabilities = [...playerDialogFormData.availabilities];
            availabilities[index] = {
                ...availabilities[index],
                start: value as Availability["start"],
            };
            setPlayerDialogFormData({
                ...playerDialogFormData,
                availabilities,
            });
        },
        [playerDialogFormData],
    );

    const updateAvailabilityEndAtIndex = useCallback(
        (index: number, value: string) => {
            const availabilities = [...playerDialogFormData.availabilities];
            availabilities[index] = {
                ...availabilities[index],
                end: value as Availability["end"],
            };
            setPlayerDialogFormData({
                ...playerDialogFormData,
                availabilities,
            });
        },
        [playerDialogFormData],
    );

    const PlayerDialog = () => {
        return (
            <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
                <Dialog.Content>
                    <Dialog.Title>
                        {action === "add" ? "Add Player" : "Edit Player"}
                    </Dialog.Title>
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
                            value={playerDialogFormData.name}
                            onChange={handleNameChange}
                        />
                        {state?.errors?.name && (
                            <>
                                <Text
                                    size="2"
                                    weight="regular"
                                    as="p"
                                    color="red"
                                >
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
                                value={playerDialogFormData.number}
                                onChange={handleNumberChange}
                                min="0"
                                max="99"
                                step="1"
                                inputMode="numeric"
                            />
                            {state?.errors?.number && (
                                <Text
                                    size="2"
                                    weight="regular"
                                    as="p"
                                    color="red"
                                >
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
                                value={playerDialogFormData.position}
                                onValueChange={handlePositionChange}
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
                                <Text
                                    size="2"
                                    weight="regular"
                                    as="p"
                                    color="red"
                                >
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
                            {playerDialogFormData.availabilities.map(
                                (availability, index) => (
                                    <AvailabilityRow
                                        key={`${index}-${availability.day}`}
                                        index={index}
                                        removeAvailabilityAtIndex={
                                            removeAvailabilityAtIndex
                                        }
                                        updateAvailabilityDayAtIndex={
                                            updateAvailabilityDayAtIndex
                                        }
                                        updateAvailabilityStartAtIndex={
                                            updateAvailabilityStartAtIndex
                                        }
                                        updateAvailabilityEndAtIndex={
                                            updateAvailabilityEndAtIndex
                                        }
                                        {...availability}
                                    />
                                ),
                            )}
                        </Flex>
                        {state?.errors?.availabilities && (
                            <>
                                <Text
                                    size="2"
                                    weight="regular"
                                    as="p"
                                    color="red"
                                >
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
        )
    }

    const value = {
        handleOpen,
        PlayerDialog
    }

    return (
        <PlayerDialogContext.Provider value={value}>
            {children}
        </PlayerDialogContext.Provider>
    );
}
