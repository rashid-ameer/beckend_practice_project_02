import { Router } from "express";
import {
  resendVerificationEmailHandler,
  verifyUserEmailHandler,
} from "../controllers/emailVerification.controller";

const emailVerificationRoutes = Router();

// prefix: /email-verification
emailVerificationRoutes.post("/verify", verifyUserEmailHandler);
emailVerificationRoutes.get("/resend", resendVerificationEmailHandler);

export default emailVerificationRoutes;
