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
import { useUser } from "../../hooks/useUser.ts";
import { ForgotPasswordFormSchema } from "../../utils/schemas.ts";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function ForgotPasswordCard() {
    const { requestPasswordReset } = useUser();

    const {
        register,
        handleSubmit,
        setError,
        formState: { isSubmitting, isValidating, errors },
    } = useForm<z.infer<typeof ForgotPasswordFormSchema>>({
        resolver: zodResolver(ForgotPasswordFormSchema),
    });

    const onSubmit = handleSubmit(async (data) => {
        try {
            await requestPasswordReset(data.email);
        } catch (error) {
            console.error(error);

            setError("email", {
                type: "manual",
                message: "An unexpected error occurred",
            });
        }
    });

    return (
        <Box width="400px">
            <Card size="4">
                <form onSubmit={onSubmit}>
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
                    <Flex direction="row-reverse" gap="4">
                        <Button
                            type="submit"
                            disabled={isSubmitting || isValidating}
                        >
                            Send Password Recovery
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
