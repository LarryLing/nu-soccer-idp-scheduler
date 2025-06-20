import type { Availability } from "../../utils/types.ts";
import { Flex, Select, TextField, Text, IconButton } from "@radix-ui/themes";
import { XIcon } from "lucide-react";
import { type ChangeEvent, useCallback } from "react";

type AvailabilityRowProps = {
    index: number;
    removeAvailabilityAtIndex: (index: number) => void;
    updateAvailabilityDayAtIndex: (index: number, value: string) => void;
    updateAvailabilityStartAtIndex: (index: number, value: string) => void;
    updateAvailabilityEndAtIndex: (index: number, value: string) => void;
} & Availability;

export default function AvailabilityRow({
    index,
    day,
    start,
    end,
    removeAvailabilityAtIndex,
    updateAvailabilityDayAtIndex,
    updateAvailabilityStartAtIndex,
    updateAvailabilityEndAtIndex,
}: AvailabilityRowProps) {
    const handleRemoveAvailability = useCallback(() => {
        removeAvailabilityAtIndex(index);
    }, [index, removeAvailabilityAtIndex]);

    const handleAvailabilityDayChange = useCallback(
        (value: string) => {
            updateAvailabilityDayAtIndex(index, value);
        },
        [index, updateAvailabilityDayAtIndex],
    );

    const handleAvailabilityStartChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            updateAvailabilityStartAtIndex(index, e.target.value);
        },
        [index, updateAvailabilityStartAtIndex],
    );

    const handleAvailabilityEndChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            updateAvailabilityEndAtIndex(index, e.target.value);
        },
        [index, updateAvailabilityEndAtIndex],
    );

    return (
        <Flex justify="between">
            <Flex align="center" gap="3">
                <Select.Root
                    defaultValue="Monday"
                    value={day}
                    onValueChange={handleAvailabilityDayChange}
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
                    value={start}
                    onChange={handleAvailabilityStartChange}
                />
                <Text size="2" weight="medium">
                    to
                </Text>
                <TextField.Root
                    style={{ width: "100px" }}
                    placeholder="ie: 10:00AM"
                    value={end}
                    onChange={handleAvailabilityEndChange}
                />
            </Flex>
            <IconButton
                variant="outline"
                color="red"
                onClick={handleRemoveAvailability}
                type="button"
            >
                <XIcon size={15} />
            </IconButton>
        </Flex>
    );
}
