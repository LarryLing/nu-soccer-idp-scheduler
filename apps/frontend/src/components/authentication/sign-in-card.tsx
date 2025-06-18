import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  TextField,
} from "@radix-ui/themes";
import { Link, useNavigate } from "react-router";
import { z } from "zod";
import { useActionState } from "react";
import { useUser } from "../../hooks/useUser.ts";

const SignInFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

type SignInFormState = {
  errors?: {
    email?: string[];
    password?: string[];
  };
} | null;

export default function SignInCard() {
  const context = useUser();
  const navigate = useNavigate();
  const [state, formAction, isPending] = useActionState<
    SignInFormState,
    FormData
  >(submitForm, null);

  async function submitForm(prevState: SignInFormState, formData: FormData) {
    const result = SignInFormSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!result.success) {
      return {
        errors: result.error.flatten().fieldErrors,
      };
    }

    await context.signIn(result.data.email, result.data.password);

    navigate("/players");
    return prevState;
  }

  return (
    <Box width="400px">
      <Card size="4">
        <form action={formAction}>
          <Heading size="6" mb="5">
            Sign In
          </Heading>
          <Box mb="5">
            <label htmlFor="email">
              <Text size="2" weight="medium" mb="1" as="p">
                Email
              </Text>
              <TextField.Root
                id="email"
                name="email"
                type="email"
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
          <Flex direction="row-reverse" gap="4">
            <Button type="submit" disabled={isPending}>
              Sign In
            </Button>
            <Link to="/create-an-account">
              <Button variant="soft" type="button" disabled={isPending}>
                Create An Account
              </Button>
            </Link>
          </Flex>
        </form>
      </Card>
    </Box>
  );
}
