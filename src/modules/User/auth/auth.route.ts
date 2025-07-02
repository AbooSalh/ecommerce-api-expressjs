import express from "express";
import authController from "./auth.controller";
import createRateLimiter from "@/common/utils/api/rateLimiter";
// import {
//   createBouncer,
// } from "@/common/utils/api/rateLimiter";

const authRouter = express.Router();
// Apply a strict rate limit for all auth endpoints: 5 requests per minute per IP
const authLimiter = createRateLimiter({
  minutes: 1,
  max: 5,
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
