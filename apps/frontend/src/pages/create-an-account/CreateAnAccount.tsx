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
import { useUser } from "../../hooks/useUser.ts";
import { useActionState } from "react";
import { CreateAnAccountSchema } from "../../utils/schemas.ts";
import type { AuthFormState } from "../../utils/types.ts";
import { FirebaseError } from "firebase/app";

export default function CreateAnAccountCard() {
    const context = useUser();
    const navigate = useNavigate();
    const [state, formAction, isPending] = useActionState<
        AuthFormState,
        FormData
    >(submitForm, null);

    async function submitForm(prevState: AuthFormState, formData: FormData) {
        const result = CreateAnAccountSchema.safeParse({
            email: formData.get("email"),
            password: formData.get("password"),
            confirmPassword: formData.get("confirmPassword"),
        });

        if (!result.success) {
            return {
                errors: result.error.flatten().fieldErrors,
            };
        }

        try {
            await context.signUp(result.data.email, result.data.password);
        } catch (error: unknown) {
            if (error instanceof FirebaseError) {
                console.error(error);

                if (error.code === "auth/email-already-in-use") {
                    return {
                        errors: {
                            email: ["Email already in use"],
                        },
                    };
                } else {
                    return {
                        errors: {
                            email: ["An unexpected error occurred"],
                        },
                    };
                }
            }
        }

        navigate("/players");
        return prevState;
    }

    return (
        <Box width="400px">
            <Card size="4">
                <form action={formAction}>
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
                            name="email"
                            placeholder="Enter your email address"
                            className="w-full"
                        />
                        {state?.errors?.email && (
                            <Text size="2" weight="regular" as="p" color="red">
                                {state.errors.email}
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
                            name="password"
                            type="password"
                            placeholder="Enter your password"
                            className="w-full"
                        />
                        {state?.errors?.password && (
                            <>
                                <Text
                                    size="2"
                                    weight="regular"
                                    as="p"
                                    color="red"
                                >
                                    Password must:
                                </Text>
                                {state.errors.password.map((value) => (
                                    <Text
                                        size="2"
                                        weight="regular"
                                        as="p"
                                        color="red"
                                    >
                                        - {value}
                                    </Text>
                                ))}
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
                    </Box>
                    <Flex direction="row-reverse" gap="4">
                        <Button type="submit" disabled={isPending}>
                            Create Account
                        </Button>
                        <Link to="/signin">
                            <Button
                                variant="soft"
                                type="button"
                                disabled={isPending}
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
