import { Flex, IconButton, Select, Text, TextField } from "@radix-ui/themes";
import { XIcon } from "lucide-react";
import type { UseFieldArrayRemove, UseFormRegister } from "react-hook-form";
import type { PlayerSchema } from "../../utils/schemas.ts";
import { z } from "zod";

const DAYS = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
] as const;

type AvailabilityRowProps = {
    index: number;
    register: UseFormRegister<z.infer<typeof PlayerSchema>>;
    remove: UseFieldArrayRemove;
};

export default function AvailabilityRow({
    index,
    register,
    remove,
}: AvailabilityRowProps) {
    return (
        <Flex justify="between">
            <Flex align="center" gap="3">
                <Select.Root
                    defaultValue="Monday"
                    {...register(`availabilities.${index}.day`)}
                >
                    <Select.Trigger style={{ width: "120px" }} />
                    <Select.Content>
                        {DAYS.map((dayOption) => (
                            <Select.Item key={dayOption} value={dayOption}>
                                {dayOption}
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Root>
                <TextField.Root
                    style={{ width: "80px" }}
                    placeholder="9:30AM"
                    {...register(`availabilities.${index}.start`)}
                />
                <Text size="2" weight="medium">
                    -
                </Text>
                <TextField.Root
                    style={{ width: "80px" }}
                    placeholder="10:00AM"
                    {...register(`availabilities.${index}.end`)}
                />
            </Flex>
            <IconButton
                variant="soft"
                color="red"
                type="button"
                onClick={() => remove(index)}
            >
                <XIcon size={15} />
            </IconButton>
        </Flex>
    );
}
