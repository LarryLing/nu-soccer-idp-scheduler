import { useNavigate, useSearchParams } from "react-router";
import ResetPasswordCard from "../../components/authentication/ResetPasswordCard.tsx";

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
        <>
            {mode === "resetPassword" && (
                <ResetPasswordCard actionCode={actionCode} />
            )}
        </>
    );
}
