import type { Availability } from "../../utils/types.ts";
import { Flex, Select, TextField, Text, IconButton } from "@radix-ui/themes";
import { XIcon } from "lucide-react";

type AvailabilityRowProps = {
    index: number;
    availability: Availability;
    handleRemoveAvailability: (index: number) => void;
    handleEditAvailability: (
        index: number,
        field: "day" | "start" | "end",
        value:
            | Availability["day"]
            | Availability["start"]
            | Availability["end"],
    ) => void;
};

export default function AvailabilityRow({
    index,
    availability,
    handleRemoveAvailability,
    handleEditAvailability,
}: AvailabilityRowProps) {
    return (
        <Flex justify="between">
            <Flex align="center" gap="3">
                <Select.Root
                    defaultValue="Monday"
                    value={availability.day}
                    onValueChange={(value) =>
                        handleEditAvailability(
                            index,
                            "day",
                            value as Availability["day"],
                        )
                    }
                >
                    <Select.Trigger style={{ width: "120px" }} />
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
                    style={{ width: "100px" }}
                    placeholder="ie: 9:30AM"
                    value={availability.start}
                    onChange={(e) =>
                        handleEditAvailability(
                            index,
                            "start",
                            e.target.value as Availability["start"],
                        )
                    }
                />
                <Text size="2" weight="medium">
                    to
                </Text>
                <TextField.Root
                    style={{ width: "100px" }}
                    placeholder="ie: 10:00AM"
                    value={availability.end}
                    onChange={(e) =>
                        handleEditAvailability(
                            index,
                            "end",
                            e.target.value as Availability["end"],
                        )
                    }
                />
            </Flex>
            <IconButton
                variant="outline"
                color="red"
                onClick={() => handleRemoveAvailability(index)}
                type="button"
            >
                <XIcon size={15} />
            </IconButton>
        </Flex>
    );
}
