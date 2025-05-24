import { Request } from "express";
import UserModel from "../model";
import ApiError from "@/common/utils/api/ApiError";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import generateCode from "@/common/utils/codeGenerator";
import sendEmail from "@/common/utils/sendEmail";
import { resetPasswordTemplate } from "@/common/utils/emailTemplates";
import crypto from "crypto";

const createToken = (payload: jwt.JwtPayload) => {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "1d",
  });
};

export const register = async (req: Request) => {
  const { name, email, password, phone } = req.body;
  const newUser = await UserModel.create({ name, email, password, phone });
  if (!newUser) throw new ApiError("User not created", "INTERNAL_SERVER_ERROR");

  const user = await UserModel.findById(newUser._id).select("-password");
  if (!user)
    throw new ApiError(
      "User not found after creation",
      "INTERNAL_SERVER_ERROR"
    );

  const token = createToken({ id: user._id });
  return { user, token };
};


export const login = async (req: Request) => {
  const { email, password } = req.body;
  const userWithPassword = await UserModel.findOne({ email });
  if (!userWithPassword) throw new ApiError("User not found", "NOT_FOUND");

  const isPasswordCorrect = await bcrypt.compare(
    password,
    userWithPassword.password
  );
  if (!isPasswordCorrect)
    throw new ApiError("Invalid Credentials", "UNAUTHORIZED");

  const user = await UserModel.findById(userWithPassword._id).select(
    "-password"
  );
  if (!user) throw new ApiError("User not found", "INTERNAL_SERVER_ERROR");

  const token = createToken({ id: user._id });
  return { user, token };
};

export const forgotPassword = async (req: Request) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });
  if (!user) throw new ApiError("User not found", "NOT_FOUND");

  const code = generateCode(6);
  const hashedCode = crypto.createHash("sha256").update(code).digest("hex");

  user.passwordResetCode = hashedCode;
  user.passwordResetCodeExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  user.passwordResetVerified = false;
  await user.save();

  try {
    await sendEmail({
      to: user.email,
      subject: "Reset Password Code",
      html: resetPasswordTemplate(code),
    });
  } catch {
    user.passwordResetCode = undefined;
    user.passwordResetCodeExpires = undefined;
    user.passwordResetVerified = undefined;
    await user.save();
    throw new ApiError("Failed to send email", "INTERNAL_SERVER_ERROR");
  }
};

export const verifyResetCode = async (req: Request) => {
  const hashedCode = crypto
    .createHash("sha256")
    .update(req.body.code)
    .digest("hex");
  const user = await UserModel.findOne({
    email: req.body.email,
    passwordResetCode: hashedCode,
    passwordResetCodeExpires: { $gt: new Date() },
  });

  if (!user)
    throw new ApiError("Invalid reset code or expired", "UNAUTHORIZED");

  user.passwordResetVerified = true;
  await user.save();
};

export const resetPassword = async (req: Request) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) throw new ApiError("User not found", "NOT_FOUND");

  if (!user.passwordResetVerified) {
    throw new ApiError("Reset code not verified", "UNAUTHORIZED");
  }

  user.password = req.body.newPassword;
  user.passwordResetCode = undefined;
  user.passwordResetCodeExpires = undefined;
  user.passwordResetVerified = undefined;
  await user.save();

  const token = createToken({ id: user._id });
  return { token };
};
