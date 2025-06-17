import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  TextField,
} from "@radix-ui/themes";

export default function SignInCard({}) {
  return (
    <Box width="400px">
      <Card size="4">
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
          <Button>Sign In</Button>
          <Button variant="soft">Create An Account</Button>
        </Flex>
      </Card>
    </Box>
  );
}
