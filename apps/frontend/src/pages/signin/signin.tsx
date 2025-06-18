import {
    Box,
    Button,
    Card,
    Flex,
    Heading,
    Link,
    Text,
    TextField,
} from "@radix-ui/themes";
import { Link as ReactRouterLink, useNavigate } from "react-router";
import { useActionState } from "react";
import { useUser } from "../../hooks/useUser.ts";
import { SignInFormSchema } from "../../utils/schemas.ts";
import type { AuthFormState } from "../../utils/types.ts";
import { FirebaseError } from "firebase/app";

export default function SignIn() {
    const context = useUser();
    const navigate = useNavigate();
    const [state, formAction, isPending] = useActionState<
        AuthFormState,
        FormData
    >(submitForm, null);

    async function submitForm(prevState: AuthFormState, formData: FormData) {
        const result = SignInFormSchema.safeParse({
            email: formData.get("email"),
            password: formData.get("password"),
        });

        if (!result.success) {
            return {
                errors: result.error.flatten().fieldErrors,
            };
        }

        try {
            await context.signIn(result.data.email, result.data.password);
        } catch (error: unknown) {
            if (error instanceof FirebaseError) {
                console.error(error);

                if (error.code === "auth/invalid-credential") {
                    return {
                        errors: {
                            email: ["Incorrect email or password"],
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
                                <Text
                                    size="2"
                                    weight="regular"
                                    as="p"
                                    color="red"
                                >
                                    {state.errors.email}
                                </Text>
                            )}
                        </label>
                    </Box>
                    <Box mb="5">
                        <label htmlFor="password">
                            <Flex justify="between">
                                <Text size="2" weight="medium" mb="1" as="p">
                                    Password
                                </Text>
                                <Link size="2" weight="medium" asChild>
                                    <ReactRouterLink to="/forgot-password">
                                        Forgot Password?
                                    </ReactRouterLink>
                                </Link>
                            </Flex>
                            <TextField.Root
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Enter your password"
                                className="w-full"
                            />
                            {state?.errors?.password && (
                                <Text
                                    size="2"
                                    weight="regular"
                                    as="p"
                                    color="red"
                                >
                                    {state.errors.password}
                                </Text>
                            )}
                        </label>
                    </Box>
                    <Flex direction="row-reverse" gap="4">
                        <Button type="submit" disabled={isPending}>
                            Sign In
                        </Button>
                        <ReactRouterLink to="/create-an-account">
                            <Button
                                variant="soft"
                                type="button"
                                disabled={isPending}
                            >
                                Create An Account
                            </Button>
                        </ReactRouterLink>
                    </Flex>
                </form>
            </Card>
        </Box>
    );
}
