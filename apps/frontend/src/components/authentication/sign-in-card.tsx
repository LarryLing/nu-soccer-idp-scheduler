import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  TextField,
} from "@radix-ui/themes";
import { Link } from "react-router";

export default function SignInCard() {
  return (
    <Box width="400px">
      <Card size="4">
        <form action={() => {}}>
          <Heading size="6" mb="5">
            Sign In
          </Heading>
          <Box mb="5">
            <label htmlFor="email">
              <Text size="2" weight="medium" mb="1" as="p">
                Email
              </Text>
              <TextField.Root
                type="email"
                name="email"
                placeholder="Enter your email address"
                className="w-full"
              />
            </label>
          </Box>
          <Box mb="5">
            <label htmlFor="password">
              <Text size="2" weight="medium" mb="1" as="p">
                Password
              </Text>
              <TextField.Root
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                className="w-full"
              />
            </label>
          </Box>
          <Flex direction="row-reverse" gap="4">
            <Button type="submit">Sign In</Button>
            <Link to="/create-an-account">
              <Button variant="soft" type="button">
                Create An Account
              </Button>
            </Link>
          </Flex>
        </form>
      </Card>
    </Box>
  );
}
