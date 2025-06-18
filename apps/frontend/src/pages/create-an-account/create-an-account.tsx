import CreateAnAccountCard from "../../components/authentication/create-an-account-card.tsx";
import { Flex } from "@radix-ui/themes";

export default function CreateAnAccount() {
    return (
        <Flex height="100vh" justify="center" align="center">
            <CreateAnAccountCard />
        </Flex>
    );
}
