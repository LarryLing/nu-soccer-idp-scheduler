import ForgotPasswordCard from "../../components/authentication/forgot-password-card.tsx";
import { Flex } from "@radix-ui/themes";

export default function ForgotPassword() {
    return (
        <Flex height="100vh" justify="center" align="center">
            <ForgotPasswordCard />
        </Flex>
    );
}
