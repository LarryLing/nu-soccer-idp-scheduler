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
import { Controller } from "react-hook-form";
import type { EditPlayerDialogContextType } from "../../utils/types.ts";
import { POSITION_OPTIONS } from "../../utils/constants.ts";

export default function EditPlayerDialog({
    isOpen,
    setIsOpen,
    register,
    control,
    isSubmitting,
    isSaving,
    isValidating,
    errors,
    fields,
    remove,
    handleClose,
    addAvailability,
    onSubmit,
}: EditPlayerDialogContextType) {
    const isFormDisabled = isSubmitting || isValidating || isSaving;

    return (
        <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
            <Dialog.Content width="450px">
                <Dialog.Title>Edit Player</Dialog.Title>
                <Dialog.Description mb="3">
                    Update player information
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
                            disabled={isFormDisabled}
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
                            disabled={isFormDisabled}
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
                        <Controller
                            name="position"
                            control={control}
                            render={({ field }) => (
                                <Select.Root
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    disabled={isFormDisabled}
                                >
                                    <Select.Trigger
                                        style={{ width: "100%" }}
                                        id="position"
                                    />
                                    <Select.Content>
                                        {POSITION_OPTIONS.map(
                                            ({ value, label }) => (
                                                <Select.Item
                                                    key={value}
                                                    value={value}
                                                >
                                                    {label}
                                                </Select.Item>
                                            ),
                                        )}
                                    </Select.Content>
                                </Select.Root>
                            )}
                        />
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
                                    onClick={addAvailability}
                                    disabled={isFormDisabled}
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
                                        control={control}
                                    />
                                );
                            })}
                        </Flex>
                    </Box>
                    <Flex direction="row-reverse" gap="2">
                        <Button type="submit" disabled={isFormDisabled}>
                            {isSaving ? "Saving..." : "Save Changes"}
                        </Button>
                        <Button
                            variant="soft"
                            type="button"
                            disabled={isFormDisabled}
                            onClick={handleClose}
                        >
                            Cancel
                        </Button>
                    </Flex>
                </form>
            </Dialog.Content>
        </Dialog.Root>
    );
}
