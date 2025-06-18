import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  TextField,
} from "@radix-ui/themes";
import { useUser } from "../../hooks/useUser.ts";
import { useActionState, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ResetPasswordFormSchema } from "../../utils/schemas.ts";
import type { AuthFormState } from "../../utils/types.ts";
import { verifyPasswordResetCode } from "firebase/auth";
import { clientAuth } from "../../utils/firebase.ts";

type ResetPasswordCardProps = {
  actionCode: string;
};

export default function ResetPasswordCard({
  actionCode,
}: ResetPasswordCardProps) {
  const context = useUser();
  const navigate = useNavigate();
  const [isActionCodeVerified, setIsActionCodeVerified] = useState(true);
  const [state, formAction, isPending] = useActionState<
    AuthFormState,
    FormData
  >(submitForm, null);

  async function submitForm(prevState: AuthFormState, formData: FormData) {
    const result = ResetPasswordFormSchema.safeParse({
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    if (!result.success) {
      return {
        errors: result.error.flatten().fieldErrors,
      };
    }

    try {
      await context.resetPassword(actionCode, result.data.password);
    } catch (error) {
      console.error(error);

      return {
        errors: {
          password: ["An unexpected error occurred"],
        }
      }
    }

    navigate("/players");
    return prevState;
  }

  useEffect(() => {
    async function verifyActionCode() {
      try {
        await verifyPasswordResetCode(clientAuth, actionCode);
      } catch {
        setIsActionCodeVerified(false);
      }
    }

    verifyActionCode();
  }, [navigate, actionCode]);

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
                <>
                  <Text size="2" weight="regular" as="p" color="red">
                    Password must:
                  </Text>
                  {state.errors.password.map((value) => (
                    <Text size="2" weight="regular" as="p" color="red">
                      - {value}
                    </Text>
                  ))}
                </>
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
              {!isActionCodeVerified && (
                <Text size="2" weight="regular" as="p" color="red">
                  Provided action code is invalid or expired
                </Text>
              )}
            </label>
          </Box>
          <Flex direction="row-reverse" gap="4">
            <Button type="submit" disabled={isPending || !isActionCodeVerified}>
              Reset Password
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
