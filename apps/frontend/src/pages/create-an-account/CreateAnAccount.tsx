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
import { CreateAnAccountSchema } from "../../utils/schemas.ts";
import { FirebaseError } from "firebase/app";
import { type SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { clientAuth } from "../../utils/firebase.ts";

export default function CreateAnAccountCard() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setError,
    formState: { isSubmitting, isValidating, errors },
  } = useForm<z.infer<typeof CreateAnAccountSchema>>({
    resolver: zodResolver(CreateAnAccountSchema),
    mode: "onSubmit",
    reValidateMode: "onSubmit",
  });

  const onSubmit: SubmitHandler<z.infer<typeof CreateAnAccountSchema>> = async (
    data,
  ) => {
    try {
      await createUserWithEmailAndPassword(
        clientAuth,
        data.email,
        data.password,
      );

      navigate("/players");
    } catch (error: unknown) {
      if (error instanceof FirebaseError) {
        console.error("Failed to create account:", error);

        if (error.code === "auth/email-already-in-use") {
          setError("email", {
            type: "manual",
            message: "Email already in use",
          });
        } else {
          setError("email", {
            type: "manual",
            message: "An unexpected error occurred",
          });
        }
      }
    }
  };

  return (
    <Box width="400px">
      <Card size="4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Heading size="6" mb="5">
            Create An Account
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
            {errors.email && (
              <Text size="2" weight="regular" as="p" color="red">
                {errors.email.message}
              </Text>
            )}
          </Box>
          <Box mb="5">
            <label htmlFor="password">
              <Text size="2" weight="medium" mb="1" as="p">
                Password
              </Text>
            </label>
            <TextField.Root
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register("password")}
            />
            {errors.password && (
              <>
                <Text size="2" weight="regular" as="p" color="red">
                  {errors.password.message}
                </Text>
              </>
            )}
          </Box>
          <Box mb="5">
            <label htmlFor="confirmPassword">
              <Text size="2" weight="medium" mb="1" as="p">
                Confirm Password
              </Text>
            </label>
            <TextField.Root
              id="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <Text size="2" weight="regular" as="p" color="red">
                {errors.confirmPassword.message}
              </Text>
            )}
          </Box>
          <Flex direction="row-reverse" gap="2">
            <Button type="submit" disabled={isSubmitting || isValidating}>
              Create Account
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
