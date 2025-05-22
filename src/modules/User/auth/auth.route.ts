import express from "express";
import authController from "./auth.controller";

const authRouter = express.Router();

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
export default authRouter;
