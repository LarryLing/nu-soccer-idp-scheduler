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
import { useNavigate, useSearchParams } from "react-router";
import { verifyPasswordResetCode } from "firebase/auth";
import { clientAuth } from "../../utils/firebase.ts";
import { ResetPasswordFormSchema } from "../../utils/schemas.ts";
import type { AuthFormState } from "../../utils/types.ts";

export default function ResetPasswordCard() {
  const context = useUser();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [state, formAction, isPending] = useActionState<
    AuthFormState,
    FormData
  >(submitForm, null);

  const mode = searchParams.get("mode");
  const actionCode = searchParams.get("oobCode");

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

    await context.resetPassword(actionCode, result.data.password);

    navigate("/players");
    return prevState;
  }

  useEffect(() => {
    async function verifyParamsAndActionCode(
      mode: string | null,
      actionCode: string | null,
    ) {
      if (!mode) {
        navigate("/", { replace: true });
        return;
      }

      if (mode !== "resetPassword") {
        navigate("/", { replace: true });
        return;
      }

      if (!actionCode) {
        navigate("/", { replace: true });
        return;
      }

      try {
        await verifyPasswordResetCode(clientAuth, actionCode);
      } catch {
        navigate("/", { replace: true });
      } finally {
        setIsLoading(false);
      }
    }

    verifyParamsAndActionCode(mode, actionCode);
  }, [navigate, mode, actionCode]);

  return (
    !isLoading && (
      <Box width="400px">
        <Card size="4">
          <form action={formAction}>
            <Box mb="5">
              <Heading size="6" mb="1">
                Reset Password
              </Heading>
              <Text size="2" weight="medium" as="p">
                After resetting, you will be prompted to log in again.
              </Text>
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
    )
  );
}
