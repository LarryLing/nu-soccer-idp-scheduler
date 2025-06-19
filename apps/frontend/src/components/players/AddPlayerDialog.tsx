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
import type { Availability, Player } from "../../utils/types.ts";
import { useState } from "react";
import AvailabilityRow from "./AvailabilityRow.tsx";
import type { PlayerSchema } from "../../utils/schemas.ts";
import { z } from "zod";
import { useFirestore } from "../../hooks/useFirestore.ts";

export default function AddPlayerDialog() {
    const { addPlayer } = useFirestore();
    const [formData, setFormData] = useState<z.infer<typeof PlayerSchema>>({
        name: "",
        number: 0,
        position: "Goalkeeper",
        availabilities: [],
    });

    const handleAddAvailability = () => {
        setFormData({
            ...formData,
            availabilities: [
                ...formData.availabilities,
                { day: "Monday", start: "", end: "" },
            ],
        });
    };

    const handleRemoveAvailability = (index: number) => {
        const availabilities = [...formData.availabilities];
        availabilities.splice(index, 1);
        setFormData({
            ...formData,
            availabilities,
        });
    };

    const handleEditAvailabilityDay = (
        index: number,
        day: Availability["day"],
    ) => {
        const availabilities = [...formData.availabilities];
        availabilities[index] = {
            ...availabilities[index],
            day: day,
        };
        setFormData({
            ...formData,
            availabilities,
        });
    };

    const handleEditAvailabilityStart = (
        index: number,
        start: Availability["start"],
    ) => {
        const availabilities = [...formData.availabilities];
        availabilities[index] = {
            ...availabilities[index],
            start: start,
        };
        setFormData({
            ...formData,
            availabilities,
        });
    };

    const handleEditAvailabilityEnd = (
        index: number,
        end: Availability["end"],
    ) => {
        const availabilities = [...formData.availabilities];
        availabilities[index] = {
            ...availabilities[index],
            end: end,
        };
        setFormData({
            ...formData,
            availabilities,
        });
    };

    return (
        <Dialog.Root>
            <Dialog.Trigger>
                <Button>
                    <PlusIcon size={15} />
                    Add Player
                </Button>
            </Dialog.Trigger>
            <Dialog.Content>
                <Dialog.Title>Add Player</Dialog.Title>
                <Dialog.Description mb="5">
                    Insert player information.
                </Dialog.Description>
                <form action={() => {}}>
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
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    name: e.target.value,
                                })
                            }
                        />
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
                                value={formData.number}
                                onChange={(e) =>
                                    setFormData({
                                        ...formData,
                                        number: parseInt(e.target.value),
                                    })
                                }
                                min="0"
                                max="99"
                                step="1"
                                inputMode="numeric"
                            />
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
                                value={formData.position}
                                onValueChange={(value) =>
                                    setFormData({
                                        ...formData,
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
                                >
                                    Add Availability
                                </Button>
                            </Flex>
                            {formData.availabilities.map(
                                (availability, index) => (
                                    <AvailabilityRow
                                        key={index}
                                        index={index}
                                        availability={availability}
                                        handleRemoveAvailability={
                                            handleRemoveAvailability
                                        }
                                        handleEditAvailabilityDay={
                                            handleEditAvailabilityDay
                                        }
                                        handleEditAvailabilityStart={
                                            handleEditAvailabilityStart
                                        }
                                        handleEditAvailabilityEnd={
                                            handleEditAvailabilityEnd
                                        }
                                    />
                                ),
                            )}
                        </Flex>
                    </Box>
                    <Flex direction="row-reverse" gap="4">
                        <Dialog.Close>
                            <Button
                                type="submit"
                                onClick={() => addPlayer(formData)}
                            >
                                Add Player
                            </Button>
                        </Dialog.Close>
                        <Dialog.Close>
                            <Button variant="soft" type="button">
                                Cancel
                            </Button>
                        </Dialog.Close>
                    </Flex>
                </form>
            </Dialog.Content>
        </Dialog.Root>
    );
}
