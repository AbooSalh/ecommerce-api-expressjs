import { body } from "express-validator";
import UserModel from "./model";
import baseController from "@/common/controllers/handlers";
import expressAsyncHandler from "express-async-handler";
import { NextFunction, Request, Response } from "express";
import ApiError from "@/common/utils/api/ApiError";
import ApiSuccess from "@/common/utils/api/ApiSuccess";
import bcrypt from "node_modules/bcryptjs";
import validatorMiddleware from "@/common/middleware/validators/validator";

export const emailValidator = [
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
export const phoneValidator = [
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
  ...baseController(UserModel, {
    excludedData: {
      create: [],
      update: ["image", "password", "email"],
    },
    excludeValidation: ["email", "phone"],
    customValidators: {
      create: { email: emailValidator, phone: phoneValidator },
      update: {
        email: emailValidator.map((v) => v.optional()),
        phone: phoneValidator.map((v) => v.optional()),
      },
    },
  }),

  changePassword: {
    handler: expressAsyncHandler(async (req: Request, res: Response) => {
      const id = req.user?._id;
      if (!id) {
        throw new ApiError("User not found", "UNAUTHORIZED");
      }
      const { newPassword } = req.body;
      const result = await UserModel.findByIdAndUpdate(
        id,
        {
          $set: {
            password: await bcrypt.hash(newPassword, 10),
            passwordChangedAt: Date.now(),
          },
        },
        { new: true, runValidators: true }
      ).select("-password");
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
    validator: [
      body("currentPassword")
        .exists()
        .withMessage("Current password is required")
        .isString()
        .withMessage("Current password must be a string")
        .custom(async (value, { req }) => {
          const id = req.user?._id as string;
          console.log(id);
          const user = await UserModel.findById(id);
          console.log(user);
          if (!user) {
            throw new ApiError("Not found", "NOT_FOUND");
          }
          const isMatch = await bcrypt.compare(value, user.password);
          console.log(isMatch);
          if (!isMatch) {
            throw new ApiError("Current password is incorrect", "BAD_REQUEST");
          }
          return true;
        }),
      body("newPassword")
        .exists()
        .withMessage("New password is required")
        .isString()
        .withMessage("New password must be a string"),
      validatorMiddleware,
    ],
  },
  getProfile: {
    handler: expressAsyncHandler(
      async (req: Request, res: Response, next: NextFunction) => {
        if (!req.user?._id) {
          throw new ApiError("User not found", "UNAUTHORIZED");
        }
        req.params.id = req.user._id.toString();
        next();
      }
    ),
  },
  updateAuthUser: {
    handler: expressAsyncHandler(async (req: Request, res: Response) => {
      const updatedUser = await UserModel.findByIdAndUpdate(
        req.user?._id,
        {
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
        },
        { new: true }
      );
      if (!updatedUser) {
        throw new ApiError("User not found", "NOT_FOUND");
      }
      return ApiSuccess.send(
        res,
        "OK",
        "User updated successfully",
        updatedUser
      );
    }),
    validator: [
      body("name")
        .exists()
        .withMessage("Name is required")
        .isString()
        .withMessage("Name must be a string"),
      ...emailValidator,
      ...phoneValidator,
      validatorMiddleware,
    ],
  },
};

export default UserC;
