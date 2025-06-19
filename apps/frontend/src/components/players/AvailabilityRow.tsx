import type { Availability } from "../../utils/types.ts";
import { Flex, Select, TextField, Text, Button } from "@radix-ui/themes";

type AvailabilityRowProps = {
    index: number;
    availability: Availability;
    handleRemoveAvailability: (index: number) => void;
    handleEditAvailabilityDay: (
        index: number,
        day: Availability["day"],
    ) => void;
    handleEditAvailabilityStart: (
        index: number,
        end: Availability["end"],
    ) => void;
    handleEditAvailabilityEnd: (
        index: number,
        end: Availability["end"],
    ) => void;
};

export default function AvailabilityRow({
    index,
    availability,
    handleRemoveAvailability,
    handleEditAvailabilityDay,
    handleEditAvailabilityStart,
    handleEditAvailabilityEnd,
}: AvailabilityRowProps) {
    return (
        <Flex justify="between">
            <Flex align="center" gap="3">
                <Select.Root
                    defaultValue="Monday"
                    value={availability.day}
                    onValueChange={(value) =>
                        handleEditAvailabilityDay(
                            index,
                            value as Availability["day"],
                        )
                    }
                >
                    <Select.Trigger style={{ width: "125px" }} />
                    <Select.Content>
                        <Select.Item value="Monday">Monday</Select.Item>
                        <Select.Item value="Tuesday">Tuesday</Select.Item>
                        <Select.Item value="Wednesday">Wednesday</Select.Item>
                        <Select.Item value="Thursday">Thursday</Select.Item>
                        <Select.Item value="Friday">Friday</Select.Item>
                        <Select.Item value="Saturday">Saturday</Select.Item>
                        <Select.Item value="Sunday">Sunday</Select.Item>
                    </Select.Content>
                </Select.Root>
                <TextField.Root
                    style={{ width: "115px" }}
                    placeholder="ie: 9:30AM"
                    value={availability.start}
                    onChange={(e) =>
                        handleEditAvailabilityStart(
                            index,
                            e.target.value as Availability["start"],
                        )
                    }
                />
                <Text size="2" weight="medium">
                    to
                </Text>
                <TextField.Root
                    style={{ width: "115px" }}
                    placeholder="ie: 10:00AM"
                    value={availability.end}
                    onChange={(e) =>
                        handleEditAvailabilityEnd(
                            index,
                            e.target.value as Availability["end"],
                        )
                    }
                />
            </Flex>
            <Button
                variant="outline"
                color="red"
                onClick={() => handleRemoveAvailability(index)}
            >
                Remove
            </Button>
        </Flex>
    );
}
