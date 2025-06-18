import { useNavigate, useSearchParams } from "react-router";
import { Flex } from "@radix-ui/themes";
import ResetPasswordCard from "../../components/authentication/reset-password-card.tsx";

export default function EmailActions() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const mode = searchParams.get("mode");
  const actionCode = searchParams.get("oobCode");

  if (!mode) {
    navigate("/", { replace: true });
    return;
  }

  if (!actionCode) {
    navigate("/", { replace: true });
    return;
  }

  return (
    <Flex height="100vh" justify="center" align="center">
      {mode === "resetPassword" && (
        <ResetPasswordCard actionCode={actionCode} />
      )}
    </Flex>
  );
}
