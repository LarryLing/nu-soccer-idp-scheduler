import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";
import { useUser } from "../hooks/useUser.ts";

export default function PublicLayout() {
    const context = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (context.user !== null) {
            navigate("/players", { replace: true });
        }
    }, [navigate, context.user]);

    return <Outlet />;
}
