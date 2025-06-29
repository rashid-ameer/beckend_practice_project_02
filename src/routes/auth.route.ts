import { Router } from "express";
import {
  loginHandler,
  logoutHandler,
  refreshAccessTokenHandler,
  registerHandler,
  requestPasswordResetHandler,
  resetPasswordHandler,
} from "../controllers/auth.controller";
import authenticate from "../middlewares/authenticate";

const authRoutes = Router();

// prefix: /auth
authRoutes.post("/register", registerHandler);
authRoutes.post("/login", loginHandler);
authRoutes.get("/refresh", refreshAccessTokenHandler);
authRoutes.post("/request-password-reset", requestPasswordResetHandler);
authRoutes.post("/password-reset", resetPasswordHandler);

// protected routes
authRoutes.get("/logout", authenticate, logoutHandler);

export default authRoutes;
