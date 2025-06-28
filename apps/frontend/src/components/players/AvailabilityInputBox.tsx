import {
  Badge,
  Box,
  Button,
  Card,
  Flex,
  Select,
  Text,
  TextField,
} from "@radix-ui/themes";
import { DAYS } from "../../utils/constants.ts";
import type { Availability } from "../../utils/types.ts";
import type {
  FormState,
  UseFieldArrayRemove,
  UseFormRegister,
} from "react-hook-form";
import { z } from "zod";
import { PlayerSchema } from "../../utils/schemas.ts";
import { parseTime } from "../../utils/helpers.ts";

type AvailabilityInputBoxProps = {
  addAvailability: (day: Availability["day"]) => void;
  isFormDisabled: boolean;
  register: UseFormRegister<z.infer<typeof PlayerSchema>>;
  fields: Availability[];
  remove: UseFieldArrayRemove;
  errors: FormState<z.infer<typeof PlayerSchema>>["errors"];
};

export function AvailabilityInputBox({
  addAvailability,
  isFormDisabled,
  register,
  fields,
  remove,
  errors,
}: AvailabilityInputBoxProps) {
  return (
    <Box mb="3">
      <Flex direction="column" gap="2">
        <Flex justify="between" align="center">
          <label>
            <Text size="2" weight="medium" as="p">
              Availabilities
            </Text>
          </label>
          <Select.Root
            value=""
            onValueChange={addAvailability}
            disabled={isFormDisabled}
          >
            <Select.Trigger placeholder="Add Availability" id="add-day" />
            <Select.Content>
              {DAYS.map((day) => (
                <Select.Item key={day} value={day}>
                  {day}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </Flex>
        {DAYS.map((day) => {
          const dayFieldsWithIndex = fields
            .map((field, originalIndex) => ({ ...field, originalIndex }))
            .filter((field) => field.day === day)
            .sort((a, b) => {
              return parseTime(a.start) - parseTime(b.start);
            });

          if (dayFieldsWithIndex.length === 0) {
            return null;
          }

          const hasOverlaps = dayFieldsWithIndex.some((current, index) => {
            if (index === 0) return false;
            const previous = dayFieldsWithIndex[index - 1];
            return parseTime(current.start) < parseTime(previous.end);
          });

          return (
            <Card key={day}>
              <Flex justify="between" align="center" mb="2" width="100%">
                <Text size="2" weight="medium">
                  {day}
                </Text>
                {hasOverlaps && <Badge color="yellow">Time Overlap!</Badge>}
              </Flex>
              <Flex direction="column" gap="1">
                {dayFieldsWithIndex.map((field, index) => (
                  <>
                    <Flex justify="between" align="center" width="100%">
                      <Flex align="center" gap="2">
                        <TextField.Root
                          style={{
                            width: "80px",
                          }}
                          placeholder="9:30AM"
                          defaultValue={field.start}
                          {...register(
                            `availabilities.${field.originalIndex}.start`,
                          )}
                        />
                        <Text size="2" weight="medium">
                          -
                        </Text>
                        <TextField.Root
                          style={{
                            width: "80px",
                          }}
                          placeholder="10:00AM"
                          defaultValue={field.end}
                          {...register(
                            `availabilities.${field.originalIndex}.end`,
                          )}
                        />
                      </Flex>
                      <Button
                        variant="soft"
                        color="red"
                        type="button"
                        onClick={() => remove(field.originalIndex)}
                      >
                        Remove
                      </Button>
                    </Flex>
                    <Flex direction="column" gap="1">
                      {(["day", "start", "end"] as const).map(
                        (fieldName) =>
                          errors.availabilities?.[index]?.[fieldName] && (
                            <Text key={fieldName} size="2" color="red">
                              {errors.availabilities[index][fieldName]?.message}
                            </Text>
                          ),
                      )}
                    </Flex>
                  </>
                ))}
              </Flex>
              {errors.root?.availabilities?.message && (
                <Text size="2" weight="regular" as="p" color="red">
                  {errors.root.availabilities.message}
                </Text>
              )}
            </Card>
          );
        })}
      </Flex>
    </Box>
  );
}
