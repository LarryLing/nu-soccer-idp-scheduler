import { Button, Flex, Select, Text, TextField } from "@radix-ui/themes";
import {
    type Control,
    Controller,
    type FormState,
    type UseFieldArrayRemove,
    type UseFormRegister,
} from "react-hook-form";
import type { PlayerSchema } from "../../utils/schemas.ts";
import { z } from "zod";
import { DAYS } from "../../utils/constants.ts";

type AvailabilityRowProps = {
    index: number;
    register: UseFormRegister<z.infer<typeof PlayerSchema>>;
    remove: UseFieldArrayRemove;
    errors: FormState<z.infer<typeof PlayerSchema>>["errors"];
    control: Control<z.infer<typeof PlayerSchema>>;
};

export default function AvailabilityRow({
    index,
    register,
    remove,
    errors,
    control,
}: AvailabilityRowProps) {
    return (
        <>
            <Flex justify="between" align="center" width="100%">
                <Controller
                    name={`availabilities.${index}.day`}
                    control={control}
                    render={({ field }) => (
                        <Select.Root
                            value={field.value}
                            onValueChange={field.onChange}
                            name={`availabilities.${index}.day`}
                        >
                            <Select.Trigger
                                style={{ width: "120px" }}
                                id={`availabilities.${index}.day`}
                            />
                            <Select.Content>
                                {DAYS.map((dayOption) => (
                                    <Select.Item
                                        key={dayOption}
                                        value={dayOption}
                                    >
                                        {dayOption}
                                    </Select.Item>
                                ))}
                            </Select.Content>
                        </Select.Root>
                    )}
                />
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
                <Button
                    variant="soft"
                    color="red"
                    type="button"
                    onClick={() => remove(index)}
                >
                    Remove
                </Button>
            </Flex>
            <Flex direction="column">
                {(["day", "start", "end"] as const).map(
                    (field) =>
                        errors.availabilities?.[index]?.[field] && (
                            <Text key={field} size="2" color="red">
                                {errors.availabilities[index][field]?.message}
                            </Text>
                        ),
                )}
            </Flex>
        </>
    );
}
