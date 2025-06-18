import { Outlet, useNavigate } from "react-router";
import Navbar from "../components/miscellaneous/navbar.tsx";
import { Box, Flex } from "@radix-ui/themes";
import { useEffect } from "react";
import { useUser } from "../hooks/useUser.ts";
import trianglify from "../../public/images/trianglify.png";

export default function ProtectedLayout() {
    const context = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (context.user === null) {
            navigate("/signin", { replace: true });
        }
    }, [navigate, context.user]);

    return (
        <Flex
            direction="column"
            height="100vh"
            style={{
                background: `url(${trianglify}) no-repeat center center fixed`,
            }}
        >
            <Navbar />
            <Box px="72px" width="100%" height="100%">
                <Outlet />
            </Box>
        </Flex>
    );
}
