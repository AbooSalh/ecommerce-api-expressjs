import { RequestHandler } from "express";
import expressAsyncHandler from "express-async-handler";
import UserModel from "./model";
import ApiSuccess from "@/common/utils/api/ApiSuccess";
import ApiError from "@/common/utils/api/ApiError";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import bcrypt from "bcryptjs";
const registerHandler: RequestHandler = expressAsyncHandler(
  async (req, res, next) => {
    const { name, email, password , phone } = req.body;
    const user = await UserModel.create({ name, email, password , phone });
    if (!user)
      return next(new ApiError("User not created", "INTERNAL_SERVER_ERROR"));
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });
    ApiSuccess.send(res, "OK", "User created successfully", { user, token });
  }
);

const loginHandler: RequestHandler = expressAsyncHandler(
  async (req, res, next) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return next(new ApiError("User not found", "NOT_FOUND"));
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect)
      return next(new ApiError("Invalid password", "UNAUTHORIZED"));
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "1d",
    });
    ApiSuccess.send(res, "OK", "User logged in successfully", { user, token });
  }
);
const authController = {
  register: {
    handler: registerHandler,
    validator: [
      body("name").notEmpty().withMessage("Name is required"),
      body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email"),
      body("password").notEmpty().withMessage("Password is required"),
    ],
  },
  login: {
    handler: loginHandler,
    validator: [
      body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email"),
      body("password").notEmpty().withMessage("Password is required"),
    ],
  },
};

export default authController;
