import { RequestHandler } from "express";
import expressAsyncHandler from "express-async-handler";
import UserModel from "../model";
import ApiSuccess from "@/common/utils/api/ApiSuccess";
import ApiError from "@/common/utils/api/ApiError";
import jwt from "jsonwebtoken";
import { body } from "express-validator";
import bcrypt from "bcryptjs";
import { emailValidator, phoneValidator } from "../controller";
import validatorMiddleware from "@/common/middleware/validators/validator";
import generateCode from "@/common/utils/codeGenerator";
import sendEmail from "@/common/utils/sendEmail";
import { resetPasswordTemplate } from "@/common/utils/emailTemplates";
import crypto from "crypto";
const createToken = (payload: jwt.JwtPayload) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
};

const registerHandler: RequestHandler = expressAsyncHandler(
  async (req, res, next) => {
    const { name, email, password, phone } = req.body;
    const newUser = await UserModel.create({ name, email, password, phone });
    if (!newUser)
      return next(new ApiError("User not created", "INTERNAL_SERVER_ERROR"));

    // Get user data without password for response
    const user = await UserModel.findById(newUser._id).select("-password");
    if (!user)
      return next(
        new ApiError("User not found after creation", "INTERNAL_SERVER_ERROR")
      );
    const token = createToken({ id: user._id });
    ApiSuccess.send(res, "OK", "User created successfully", { user, token });
  }
);

const loginHandler: RequestHandler = expressAsyncHandler(
  async (req, res, next) => {
    const { email, password } = req.body;
    const userWithPassword = await UserModel.findOne({ email });
    if (!userWithPassword)
      return next(new ApiError("User not found", "NOT_FOUND"));
    const isPasswordCorrect = await bcrypt.compare(
      password,
      userWithPassword.password
    );
    if (!isPasswordCorrect)
      return next(new ApiError("Invalid Credentials", "UNAUTHORIZED"));

    // Get user data without password for response
    const user = await UserModel.findById(userWithPassword._id).select(
      "-password"
    );
    if (!user)
      return next(new ApiError("User not found", "INTERNAL_SERVER_ERROR"));
    const token = createToken({ id: user._id });
    ApiSuccess.send(res, "OK", "User logged in successfully", { user, token });
  }
);
const forgotPasswordHandler: RequestHandler = expressAsyncHandler(
  async (req, res) => {
    // 1 get user by email
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) {
      throw new ApiError("User not found", "NOT_FOUND");
    }

    // 2 generate secure code based on user data
    const code = generateCode(6);
    const hashedCode = crypto.createHash("sha256").update(code).digest("hex");
    // 3 save code to user document
    user.passwordResetCode = hashedCode;
    user.passwordResetCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    user.passwordResetVerified = false;
    await user.save();
    // 4 send code to user email
    try {
      await sendEmail({
        to: user.email,
        subject: "Reset Password Code",
        html: resetPasswordTemplate(code),
      });
    } catch (err) {
      console.log(err);
      user.passwordResetCode = null;
      user.passwordResetCodeExpires = null;
      user.passwordResetVerified = undefined;
      await user.save();
      throw new ApiError("Failed to send email", "INTERNAL_SERVER_ERROR");
    }
    // 5 return success message
    return ApiSuccess.send(res, "OK", "Reset code has been sent to your email");
  }
);
const verifyResetCodeHandler: RequestHandler = expressAsyncHandler(
  async (req, res) => {
    const hashedCode = crypto.createHash("sha256").update(req.body.code).digest("hex");
    const user = await UserModel.findOne({
      passwordResetCode: hashedCode,
      passwordResetCodeExpires: { $gt: new Date() },
    });
    if (!user) {
      throw new ApiError("Invalid reset code or expired", "UNAUTHORIZED");
    }
    // if reset code is correct, create a token for the user
    user.passwordResetVerified = true;
    await user.save();
    return ApiSuccess.send(res, "OK", "Reset code verified successfully");
  }
);
const authController = {
  register: {
    handler: registerHandler,
    validator: [
      body("name").notEmpty().withMessage("Name is required"),
      body("password").notEmpty().withMessage("Password is required"),
      ...emailValidator,
      ...phoneValidator,
      validatorMiddleware,
    ],
  },
  login: {
    handler: loginHandler,
    validator: [
      body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email"),
      body("password").notEmpty().withMessage("Password is required"),
      validatorMiddleware,
    ],
  },
  forgotPassword: {
    handler: forgotPasswordHandler,
    validator: [
      body("email")
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email"),
      validatorMiddleware,
    ],
  },
  verifyResetCode: {
    handler: verifyResetCodeHandler,
    validator: [
      body("code").notEmpty().withMessage("Reset code is required"),
      validatorMiddleware,
    ],
  },
};

export default authController;
