import express from "express";
import authController from "./auth.controller";
import {
  createBouncer,
} from "@/common/utils/api/rateLimiter";

const authRouter = express.Router();
// Apply a strict rate limit for all auth endpoints: 5 requests per minute per IP
const authLimiter = createBouncer({
  maxAttempts: 5, // Allow 5 attempts per IP
  lockMinutes: 15, // Lockout for 15 minutes after max attempts
  coolOffMinutes: 5, // Cool-off period of 5 minutes before retrying
});
authRouter.use(authLimiter);

authRouter.post(
  "/register",
  authController.register.validator,
  authController.register.handler
);
authRouter.post(
  "/login",
  authController.login.validator,
  authController.login.handler
);
authRouter.post(
  "/forgot-password",
  authController.forgotPassword.validator,
  authController.forgotPassword.handler
);
authRouter.post(
  "/verify-reset-code",
  authController.verifyResetCode.validator,
  authController.verifyResetCode.handler
);
authRouter.put(
  "/reset-password",
  authController.resetPassword.validator,
  authController.resetPassword.handler
);
export default authRouter;
