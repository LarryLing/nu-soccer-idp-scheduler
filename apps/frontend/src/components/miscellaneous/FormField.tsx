import { Box, Text } from "@radix-ui/themes";

type FormFieldProps = {
  label: string;
  id: string;
  children: React.ReactNode;
  error?: string;
};

export default function FormField({
  label,
  id,
  children,
  error,
}: FormFieldProps) {
  return (
    <Box mb="3">
      <label htmlFor={id}>
        <Text size="2" weight="medium" mb="1" as="p">
          {label}
        </Text>
      </label>
      {children}
      {error && (
        <Text size="2" weight="regular" as="p" color="red">
          {error}
        </Text>
      )}
    </Box>
  );
}
