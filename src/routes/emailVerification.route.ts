import { Router } from "express";
import { verifyUserEmailHandler } from "../controllers/emailVerification.controller";

const emailVerificationRoutes = Router();

// prefix: /email-verification
emailVerificationRoutes.post("/verify", verifyUserEmailHandler);

export default emailVerificationRoutes;
