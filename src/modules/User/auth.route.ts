import express from "express";
import authController from "./auth.controller";

const authRouter = express.Router();

authRouter.post("/register", authController.register.validator, authController.register.handler);
authRouter.post("/login", authController.login.validator, authController.login.handler);

export default authRouter;


