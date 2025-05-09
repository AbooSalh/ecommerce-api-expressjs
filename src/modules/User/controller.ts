import { body } from "express-validator";
import UserModel from "./model";
import baseController from "@/common/controllers/handlers";
import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import ApiError from "@/common/utils/api/ApiError";
import ApiSuccess from "@/common/utils/api/ApiSuccess";
import bcrypt from "node_modules/bcryptjs";

const emailValidator = [
  body("email")
    .exists()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Invalid email format")
    .normalizeEmail()
    .custom(async (email) => {
      const exists = await UserModel.findOne({ email });
      if (exists) {
        throw new Error("Email already in use");
      }
    }),
];
const phoneValidator = [
  body("phone")
    .exists()
    .withMessage("Phone number is required")
    .isMobilePhone("any")
    .withMessage("Invalid phone number format")
    .custom(async (phone) => {
      const exists = await UserModel.findOne({ phone });
      if (exists) {
        throw new Error("Phone number already in use");
      }
    }),
];
export const UserC = {
  ...baseController(
    UserModel,
    {
      create: ["role"],
      update: ["image", "role"],
    },
    ["email", "phone"],
    {
      create: { email: emailValidator, phone: phoneValidator },
      update: {
        email: emailValidator.map((v) => v.optional()),
        phone: phoneValidator.map((v) => v.optional()),
      },
    }
  ),
  changePassword: {
    handler: expressAsyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
      const { password } = req.body;
      const result = await UserModel.findByIdAndUpdate(
        id,
        { $set: { password: await bcrypt.hash(password, 10) } },
        { new: true, runValidators: true }
      );
      if (!result) {
        throw new ApiError("Not found", "NOT_FOUND");
      }
      return ApiSuccess.send(
        res,
        "OK",
        "Password updated successfully",
        result
      );
    }),
    validator: [],
  },
};

export default UserC;
