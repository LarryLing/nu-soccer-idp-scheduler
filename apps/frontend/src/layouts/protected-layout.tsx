import { Outlet, useNavigate } from "react-router";
import Navbar from "../components/miscellaneous/navbar.tsx";
import { Box } from "@radix-ui/themes";
import { useEffect } from "react";

export default function ProtectedLayout() {
  const user = null;
  const navigate = useNavigate();

  useEffect(() => {
    if (user === null) {
      navigate("/signin", { replace: true });
    }
  }, [navigate]);

  return (
    <>
      <Navbar />
      <Box p="72px" width="100%" height="100%">
        <Outlet />
      </Box>
    </>
  );
}
