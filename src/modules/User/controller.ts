import { body } from "express-validator";
import UserModel from "./model";
import baseController from "@/common/controllers/handlers";

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
    [],
    ["email", "phone"], // exclude default email validator
    {
      create: { email: emailValidator, phone: phoneValidator },
      update: {
        email: emailValidator.map((v) => v.optional()),
        phone: phoneValidator.map((v) => v.optional()),
      },
    }
  ),
};

export default UserC;
