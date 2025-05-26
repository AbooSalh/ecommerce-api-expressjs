import UserModel from "./model";
import baseController from "@/common/controllers/handlers";
import expressAsyncHandler from "express-async-handler";
import * as userService from "./user.service";
import * as userValidator from "./user.validator";

export const UserC = {
  ...baseController(UserModel, {
    excludedData: {
      create: ["wishlist"],
      update: ["password", "email", "wishlist"],
    },
    excludeValidation: ["email", "phone", "wishlist"],
    customValidators: {
      create: {
        email: userValidator.emailValidator,
      },
      update: {
        email: userValidator.emailValidator.map((v) => v.optional()),
      },
    },
  }),

  changePassword: {
    handler: expressAsyncHandler(userService.changePassword),
    validator: userValidator.changePasswordValidator,
  },

  getProfile: {
    handler: expressAsyncHandler(userService.getProfile),
  },

  updateAuthUser: {
    handler: expressAsyncHandler(userService.updateAuthUser),
    validator: userValidator.updateAuthUserValidator,
  },
};

export default UserC;
