import NorthwesternLogo from "../../assets/NorthwesternLogo.tsx";
import { Button, Flex, Text, Link } from "@radix-ui/themes";
import { Link as ReactRouterLink } from "react-router";
import { useUser } from "../../hooks/useUser.ts";
import { LogOutIcon } from "lucide-react";

export default function Navbar() {
    const { signOut } = useUser();

    return (
        <Flex
            px="72px"
            py="20px"
            width="100%"
            justify="between"
            align="center"
            style={{
                borderBottom: "1px solid",
                borderColor: "var(--gray-5)",
                backgroundColor: "var(--color-panel)",
            }}
        >
            <Flex gap="4" align="center">
                <NorthwesternLogo height={40} width={25.51} />
                <Text size="6" align="left" weight="bold">
                    IDP Scheduler
                </Text>
            </Flex>
            <Flex gap="5" align="center">
                <Link weight="medium" color="gray" asChild>
                    <ReactRouterLink to="/players">Players</ReactRouterLink>
                </Link>
                <Link weight="medium" color="gray" asChild>
                    <ReactRouterLink to="/training-blocks">
                        Training Blocks
                    </ReactRouterLink>
                </Link>
                <Button type="button" onClick={signOut}>
                    <LogOutIcon size={15} />
                    Sign Out
                </Button>
            </Flex>
        </Flex>
    );
}
