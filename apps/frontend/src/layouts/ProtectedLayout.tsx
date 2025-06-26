import { Outlet, useNavigate } from "react-router";
import Navbar from "../components/miscellaneous/Navbar.tsx";
import { Flex } from "@radix-ui/themes";
import { useEffect } from "react";
import { useUser } from "../hooks/useUser.ts";
import trianglify from "../images/trianglify.png";

export default function ProtectedLayout() {
    const { user } = useUser();

    const navigate = useNavigate();

    useEffect(() => {
        if (user === null) {
            navigate("/signin", { replace: true });
        }
    }, [navigate, user]);

    return (
        user && (
            <Flex
                direction="column"
                minHeight="100vh"
                style={{
                    background: `url(${trianglify}) no-repeat center center fixed`,
                }}
            >
                <Navbar />
                <Flex
                    direction="column"
                    gap="4"
                    px={{
                        initial: "32px",
                        md: "72px",
                    }}
                    py="6"
                    width="100%"
                >
                    <Outlet />
                </Flex>
            </Flex>
        )
    );
}
