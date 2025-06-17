import {
  Box,
  Button,
  Card,
  Flex,
  Heading,
  Text,
  TextField,
} from "@radix-ui/themes";

export default function ForgotPasswordCard() {
  return (
    <Box width="400px">
      <Card size="4">
        <Heading size="6" mb="5">
          Forgot Password
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
        <Flex direction="row-reverse" gap="4">
          <Button>Send Password Recovery</Button>
          <Button variant="soft">Go Back</Button>
        </Flex>
      </Card>
    </Box>
  );
}
