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
import { useUser } from "../../hooks/useUser.ts";
import { SignInFormSchema } from "../../utils/schemas.ts";
import { FirebaseError } from "firebase/app";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function SignIn() {
    const { signIn } = useUser();

    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        formState: { isSubmitting, isValidating, errors },
    } = useForm<z.infer<typeof SignInFormSchema>>({
        resolver: zodResolver(SignInFormSchema),
    });

    const onSubmit = handleSubmit(async (data) => {
        try {
            await signIn(data.email, data.password);

            navigate("/players");
        } catch (error: unknown) {
            if (error instanceof FirebaseError) {
                console.error(error);

                if (error.code === "auth/invalid-credential") {
                    setError("email", {
                        type: "manual",
                        message: "Incorrect email or password",
                    });
                } else {
                    setError("email", {
                        type: "manual",
                        message: "An unexpected error occurred",
                    });
                }
            }
        }
    });

    return (
        <Box width="400px">
            <Card size="4">
                <form onSubmit={onSubmit}>
                    <Heading size="6" mb="5">
                        Sign In
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
                        <Flex justify="between">
                            <label htmlFor="password">
                                <Text size="2" weight="medium" mb="1" as="p">
                                    Password
                                </Text>
                            </label>
                            <Link size="2" weight="medium" asChild>
                                <ReactRouterLink to="/forgot-password">
                                    Forgot Password?
                                </ReactRouterLink>
                            </Link>
                        </Flex>
                        <TextField.Root
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            {...register("password")}
                        />
                        {errors.password && (
                            <Text size="2" weight="regular" as="p" color="red">
                                {errors.password.message}
                            </Text>
                        )}
                    </Box>
                    <Flex direction="row-reverse" gap="2">
                        <Button
                            type="submit"
                            disabled={isSubmitting || isValidating}
                        >
                            Sign In
                        </Button>
                        <ReactRouterLink to="/create-an-account">
                            <Button
                                variant="soft"
                                type="button"
                                disabled={isSubmitting || isValidating}
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
