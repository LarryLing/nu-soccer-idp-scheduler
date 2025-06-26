import {
    Box,
    Button,
    Card,
    Flex,
    Heading,
    Text,
    TextField,
} from "@radix-ui/themes";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { ResetPasswordFormSchema } from "../../utils/schemas.ts";
import { confirmPasswordReset, verifyPasswordResetCode } from "firebase/auth";
import { clientAuth } from "../../utils/firebase.ts";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

type ResetPasswordCardProps = {
    actionCode: string;
};

export default function ResetPasswordCard({
    actionCode,
}: ResetPasswordCardProps) {
    const navigate = useNavigate();

    const [isActionCodeVerified, setIsActionCodeVerified] = useState(true);

    const {
        register,
        handleSubmit,
        setError,
        formState: { isSubmitting, isValidating, errors },
    } = useForm<z.infer<typeof ResetPasswordFormSchema>>({
        resolver: zodResolver(ResetPasswordFormSchema),
    });

    const onSubmit = handleSubmit(async (data) => {
        try {
            await confirmPasswordReset(clientAuth, actionCode, data.password);

            navigate("/players");
        } catch (error) {
            console.error(error);

            setError("password", {
                type: "manual",
                message: "An unexpected error occurred",
            });
        }
    });

    useEffect(() => {
        async function verifyActionCode() {
            try {
                await verifyPasswordResetCode(clientAuth, actionCode);
            } catch {
                setIsActionCodeVerified(false);
                setError("password", {
                    type: "manual",
                    message: "Provided action code is invalid or expired",
                });
            }
        }

        verifyActionCode();
    }, [navigate, actionCode, setError]);

    return (
        <Box width="400px">
            <Card size="4">
                <form onSubmit={onSubmit}>
                    <Heading size="6" mb="5">
                        Reset Password
                    </Heading>
                    <Box mb="5">
                        <label htmlFor="password">
                            <Text size="2" weight="medium" mb="1" mt="1" as="p">
                                Password
                            </Text>
                        </label>
                        <TextField.Root
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            {...register("password")}
                            disabled={!isActionCodeVerified}
                        />
                        {errors?.password && (
                            <>
                                <Text
                                    size="2"
                                    weight="regular"
                                    as="p"
                                    color="red"
                                >
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
                            disabled={!isActionCodeVerified}
                        />
                        {errors?.confirmPassword && (
                            <Text size="2" weight="regular" as="p" color="red">
                                {errors.confirmPassword.message}
                            </Text>
                        )}
                    </Box>
                    <Flex direction="row-reverse" gap="2">
                        <Button
                            type="submit"
                            disabled={
                                isSubmitting ||
                                isValidating ||
                                !isActionCodeVerified
                            }
                        >
                            Reset Password
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
