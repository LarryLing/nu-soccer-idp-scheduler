import SignInCard from "../../components/authentication/sign-in-card.tsx";
import { Flex } from "@radix-ui/themes";

export default function SignIn() {
    return (
        <Flex height="100vh" justify="center" align="center">
            <SignInCard />
        </Flex>
    );
}
