import { Button, Flex } from "@radix-ui/themes";

type FormActionsProps = {
  isDisabled: boolean;
  isPerformingAction: boolean;
  onCancel: () => void;
};

export default function FormActions({
  isDisabled,
  isPerformingAction,
  onCancel,
}: FormActionsProps) {
  return (
    <Flex direction="row-reverse" gap="2">
      <Button type="submit" disabled={isDisabled}>
        {isPerformingAction ? "Adding..." : "Add Training Block"}
      </Button>
      <Button
        variant="soft"
        type="button"
        disabled={isDisabled}
        onClick={onCancel}
      >
        Cancel
      </Button>
    </Flex>
  );
}
