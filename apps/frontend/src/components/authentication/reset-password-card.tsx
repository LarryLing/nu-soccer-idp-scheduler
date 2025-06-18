import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  TextField,
} from "@radix-ui/themes";
import { z } from "zod";
import { useUser } from "../../hooks/useUser.ts";
import { useActionState } from "react";
import { useNavigate } from "react-router";

const ResetPasswordFormSchema = z.object({
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
});

type ResetPasswordFormState = {
  errors?: {
    password?: string[];
    confirmPassword?: string[];
  };
} | null;

export default function ResetPasswordCard() {
  const context = useUser();
  const navigate = useNavigate();
  const [state, formAction, isPending] = useActionState<
    ResetPasswordFormState,
    FormData
  >(submitForm, null);

  async function submitForm(
    prevState: ResetPasswordFormState,
    formData: FormData,
  ) {
    const result = ResetPasswordFormSchema.safeParse({
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    if (!result.success) {
      return {
        errors: result.error.flatten().fieldErrors,
      };
    }

    await context.resetPassword(result.data.password);

    navigate("/players");
    return prevState;
  }

  return (
    <Box width="400px">
      <Card size="4">
        <form action={formAction}>
          <Heading size="6" mb="5">
            Reset Password
          </Heading>
          <Box mb="5">
            <label htmlFor="password">
              <Text size="2" weight="medium" mb="1" as="p">
                Password
              </Text>
              <TextField.Root
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className="w-full"
              />
              {state?.errors?.password && (
                <Text size="2" weight="regular" as="p" color="red">
                  {state.errors.password}
                </Text>
              )}
            </label>
          </Box>
          <Box mb="5">
            <label htmlFor="confirmPassword">
              <Text size="2" weight="medium" mb="1" as="p">
                Confirm Password
              </Text>
              <TextField.Root
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                className="w-full"
              />
              {state?.errors?.confirmPassword && (
                <Text size="2" weight="regular" as="p" color="red">
                  {state.errors.confirmPassword}
                </Text>
              )}
            </label>
          </Box>
          <Flex direction="row-reverse" gap="4">
            <Button type="submit" disabled={isPending}>
              Reset Password
            </Button>
          </Flex>
        </form>
      </Card>
    </Box>
  );
}
