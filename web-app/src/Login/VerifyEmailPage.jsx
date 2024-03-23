import { CircularProgress } from "@mui/material";
import React from "react";
import { useParams } from "react-router-dom";
import { useAuthContext } from "../common/context/AuthContext";
import { AuthenticationService } from "../common/services/AuthenticationService";

export default function VerifyEmailPage() {
  const { verificationCode, userId } = useParams();
  const { loginAsUser } = useAuthContext();

  React.useEffect(() => {
    if (verificationCode && userId && loginAsUser) {
      AuthenticationService.verifyEmail(userId, verificationCode).then((verifiedUser) => {
        loginAsUser(verifiedUser);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verificationCode, userId]);

  return (
    <div>
      Verifying <CircularProgress />
    </div>
  );
}
