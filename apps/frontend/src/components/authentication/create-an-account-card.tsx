import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  TextField,
} from "@radix-ui/themes";

export default function CreateAnAccountCard() {
  return (
    <Box width="400px">
      <Card size="4">
        <Heading size="6" mb="5">
          Create An Account
        </Heading>
        <Box mb="5">
          <label htmlFor="email">
            <Text size="2" weight="medium" mb="1" as="p">
              Email
            </Text>
            <TextField.Root
              id="email"
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
        <Box mb="5">
          <label htmlFor="confirmPassword">
            <Text size="2" weight="medium" mb="1" as="p">
              Confirm Password
            </Text>
            <TextField.Root
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              className="w-full"
            />
          </label>
        </Box>
        <Flex direction="row-reverse" gap="4">
          <Button>Create Account</Button>
          <Button variant="soft">Go Back</Button>
        </Flex>
      </Card>
    </Box>
  );
}
