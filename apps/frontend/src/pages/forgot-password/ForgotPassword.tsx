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
import { ForgotPasswordFormSchema } from "../../utils/schemas.ts";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { sendPasswordResetEmail } from "firebase/auth";
import { clientAuth } from "../../utils/firebase.ts";

export default function ForgotPasswordCard() {
  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, isValidating, errors },
  } = useForm<z.infer<typeof ForgotPasswordFormSchema>>({
    resolver: zodResolver(ForgotPasswordFormSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onSubmit: SubmitHandler<
    z.infer<typeof ForgotPasswordFormSchema>
  > = async (data) => {
    try {
      await sendPasswordResetEmail(clientAuth, data.email);
    } catch (error) {
      console.error("Failed to send password reset email:", error);

      setError("email", {
        type: "manual",
        message: "An unexpected error occurred",
      });
    }
  };

  return (
    <Box width="400px">
      <Card size="4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Heading size="6" mb="5">
            Forgot Password
          </Heading>
          <Box mb="5">
            <label htmlFor="email">
              <Text size="2" weight="medium" mb="1" as="p">
                Email
              </Text>
            </label>
            <TextField.Root
              id="email"
              placeholder="Enter your email address"
              {...register("email")}
            />
            {errors?.email && (
              <Text size="2" weight="regular" as="p" color="red">
                {errors.email.message}
              </Text>
            )}
          </Box>
          <Flex direction="row-reverse" gap="2">
            <Button type="submit" disabled={isSubmitting || isValidating}>
              Send Recovery Email
            </Button>
            <Link to="/signin">
              <Button
                variant="soft"
                type="button"
                disabled={isSubmitting || isValidating}
              >
                Go Back
              </Button>
            </Link>
          </Flex>
        </form>
      </Card>
    </Box>
  );
}
