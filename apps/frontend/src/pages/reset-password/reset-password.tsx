import ResetPasswordCard from "../../components/authentication/reset-password-card.tsx";
import { Flex } from "@radix-ui/themes";

export default function ResetPassword() {
  return (
    <Flex height="100vh" justify="center" align="center">
      <ResetPasswordCard />
    </Flex>
  );
}
