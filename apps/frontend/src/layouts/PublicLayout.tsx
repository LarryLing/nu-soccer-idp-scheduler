import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";
import { useUser } from "../hooks/useUser.ts";
import { Flex } from "@radix-ui/themes";
import trianglify from "../images/trianglify.png";

export default function PublicLayout() {
    const { user } = useUser();

    const navigate = useNavigate();

    useEffect(() => {
        if (user !== null) {
            navigate("/players", { replace: true });
        }
    }, [navigate, user]);

    return (
        <Flex
            height="100vh"
            justify="center"
            align="center"
            style={{
                backgroundImage: `url(${trianglify})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundAttachment: "fixed",
            }}
        >
            <Outlet />
        </Flex>
    );
}
