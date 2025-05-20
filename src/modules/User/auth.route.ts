import express from "express";
import authController from "./auth.controller";

const authRouter = express.Router();

authRouter.post("/register", authController.register.validator, authController.register.handler);

export default authRouter;


