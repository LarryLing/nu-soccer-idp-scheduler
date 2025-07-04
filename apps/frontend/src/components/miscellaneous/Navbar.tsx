import NorthwesternLogo from "./NorthwesternLogo.tsx";
import { Button, Flex, Link, IconButton, Box, Heading } from "@radix-ui/themes";
import { Link as ReactRouterLink } from "react-router";
import { LogOutIcon } from "lucide-react";
import { signOut } from "firebase/auth";
import { clientAuth } from "../../utils/firebase.ts";

export default function Navbar() {
  const handleSignout = async () => {
    await signOut(clientAuth);
  };

  return (
    <Flex
      px={{
        initial: "32px",
        sm: "72px",
      }}
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
        <Box display={{ initial: "none", sm: "block" }}>
          <Heading size="6" align="left">
            IDP Scheduler
          </Heading>
        </Box>
      </Flex>
      <Flex gap="4" align="center">
        <Link weight="medium" color="gray" size="2" asChild>
          <ReactRouterLink to="/players">Players</ReactRouterLink>
        </Link>
        <Link weight="medium" color="gray" size="2" asChild>
          <ReactRouterLink to="/training-blocks">
            Training Blocks
          </ReactRouterLink>
        </Link>
        <Box display={{ initial: "none", sm: "block" }}>
          <Button type="button" onClick={handleSignout}>
            <LogOutIcon size={15} />
            Sign Out
          </Button>
        </Box>
        <Box display={{ initial: "block", sm: "none" }}>
          <IconButton type="button" onClick={handleSignout}>
            <LogOutIcon size={15} />
          </IconButton>
        </Box>
      </Flex>
    </Flex>
  );
}
