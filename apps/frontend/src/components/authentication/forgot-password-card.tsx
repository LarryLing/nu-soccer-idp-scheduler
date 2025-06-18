import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  TextField,
} from "@radix-ui/themes";
import { Link } from "react-router";
import { z } from "zod";
import { useUser } from "../../hooks/useUser.ts";
import { useActionState } from "react";

const ForgotPasswordFormSchema = z.object({
  email: z.string().email(),
});

type ForgotPasswordFormState = {
  errors?: {
    email?: string[];
  };
} | null;

export default function ForgotPasswordCard() {
  const context = useUser();
  const [state, formAction, isPending] = useActionState<
    ForgotPasswordFormState,
    FormData
  >(submitForm, null);

  async function submitForm(
    prevState: ForgotPasswordFormState,
    formData: FormData,
  ) {
    const result = ForgotPasswordFormSchema.safeParse({
      email: formData.get("email"),
    });

    if (!result.success) {
      return {
        errors: result.error.flatten().fieldErrors,
      };
    }

    await context.requestPasswordReset(result.data.email);

    return prevState;
  }

  return (
    <Box width="400px">
      <Card size="4">
        <form action={formAction}>
          <Heading size="6" mb="5">
            Forgot Password
          </Heading>
          <Box mb="5">
            <label htmlFor="email">
              <Text size="2" weight="medium" mb="1" as="p">
                Email
              </Text>
              <TextField.Root
                id="email"
                name="email"
                placeholder="Enter your email address"
                className="w-full"
              />
              {state?.errors?.email && (
                <Text size="2" weight="regular" as="p" color="red">
                  {state.errors.email}
                </Text>
              )}
            </label>
          </Box>
          <Flex direction="row-reverse" gap="4">
            <Button type="submit" disabled={isPending}>
              Send Password Recovery
            </Button>
            <Link to="/signin">
              <Button variant="soft" type="button" disabled={isPending}>
                Go Back
              </Button>
            </Link>
          </Flex>
        </form>
      </Card>
    </Box>
  );
}
