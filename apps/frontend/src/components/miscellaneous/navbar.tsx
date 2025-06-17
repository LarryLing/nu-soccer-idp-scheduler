import NorthwesternLogo from "../../assets/northwestern-logo.tsx";
import { Button, Flex, Text, Link } from "@radix-ui/themes";

export default function Navbar() {
  return (
    <Flex
      px="72px"
      py="20px"
      width="100%"
      justify="between"
      align="center"
      style={{ borderBottom: "1px solid", borderColor: "var(--gray-5)" }}
    >
      <Flex gap="4" align="center">
        <NorthwesternLogo height={40} width={25.51} />
        <Text size="6" align="left" weight="bold">
          IDP Scheduler
        </Text>
      </Flex>
      <Flex gap="5" align="center">
        <Link href="#" weight="medium" color="gray">
          Players
        </Link>
        <Link href="#" weight="medium" color="gray">
          Training Blocks
        </Link>
        <Link href="#" asChild>
          <Button>Sign Out</Button>
        </Link>
      </Flex>
    </Flex>
  );
}
