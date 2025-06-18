import { Outlet, useNavigate } from "react-router";
import Navbar from "../components/miscellaneous/navbar.tsx";
import { Box } from "@radix-ui/themes";
import { useEffect } from "react";
import { useUser } from "../hooks/useUser.ts";

export default function ProtectedLayout() {
    const context = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (context.user === null) {
            navigate("/signin", { replace: true });
        }
    }, [navigate, context.user]);

    return (
        context.isLoading && (
            <>
                <Navbar />
                <Box p="72px" width="100%" height="100%">
                    <Outlet />
                </Box>
            </>
        )
    );
}
