import ApiSuccess from "@/common/utils/api/ApiSuccess";
import UserModel from "../model";
import { RequestHandler } from "express";
import ApiError from "@/common/utils/api/ApiError";
import { body, param } from "express-validator";
import expressAsyncHandler from "express-async-handler";
import validatorMiddleware from "@/common/middleware/validators/validator";

const addAddressHandler: RequestHandler = async (req, res, next) => {
  const { alias, details, phone, city, postalCode, isDefault } = req.body;

  // Check if user already has an address with the same details
  const existingUser = await UserModel.findById(req.user?._id);
  if (!existingUser) {
    return next(new ApiError("User not found", "NOT_FOUND"));
  }

  // Check for duplicate address (same alias, details, phone, city, and postal code)
  const isDuplicate = existingUser.addresses.some(
    (address) =>
      address.alias === alias &&
      address.details === details &&
      address.phone === phone &&
      address.city === city &&
      address.postalCode === postalCode
  );

  if (isDuplicate) {
    return next(new ApiError("Address already exists", "CONFLICT"));
  }

  // Determine if this should be the default address
  const shouldBeDefault = isDefault || existingUser.addresses.length === 0;

  // If this address is set as default and there are existing addresses, unset all other addresses as default
  if (shouldBeDefault && existingUser.addresses.length > 0) {
    await UserModel.findByIdAndUpdate(req.user?._id, {
      $set: { "addresses.isDefault": false },
    });
  }

  const user = await UserModel.findByIdAndUpdate(
    req.user?._id,
    {
      $push: {
        addresses: {
          alias,
          details,
          phone,
          city,
          postalCode,
          isDefault: shouldBeDefault,
        },
      },
    },
    { new: true }
  );

  if (!user) {
    return next(new ApiError("User not found", "NOT_FOUND"));
  }

  return ApiSuccess.send(
    res,
    "CREATED",
    "address added successfully",
    user.addresses[user.addresses.length - 1]
  );
};

const removeAddressHandler: RequestHandler = async (req, res, next) => {
  const { addressId } = req.params;

  const user = await UserModel.findByIdAndUpdate(
    req.user?._id,
    {
      $pull: { addresses: { _id: addressId } },
    },
    { new: true }
  );

  if (!user) {
    return next(new ApiError("User not found", "NOT_FOUND"));
  }

  return ApiSuccess.send(
    res,
    "OK",
    "address removed successfully",
    user.addresses
  );
};
const getAddressesHandler: RequestHandler = async (req, res, next) => {
  const user = await UserModel.findById(req.user?._id);
  if (!user) {
    return next(new ApiError("User not found", "NOT_FOUND"));
  }

  return ApiSuccess.send(
    res,
    "OK",
    "addresses retrieved successfully",
    user.addresses
  );
};

const getAddressHandler: RequestHandler = async (req, res, next) => {
  const { addressId } = req.params;

  const user = await UserModel.findById(req.user?._id);
  if (!user) {
    return next(new ApiError("User not found", "NOT_FOUND"));
  }

  const address = user.addresses.find(
    (addr) => addr._id.toString() === addressId
  );
  if (!address) {
    return next(new ApiError("Address not found", "NOT_FOUND"));
  }

  return ApiSuccess.send(res, "OK", "address retrieved successfully", address);
};

const AddressC = {
  addAddress: {
    handler: expressAsyncHandler(addAddressHandler),
    validator: [
      body("alias")
        .notEmpty()
        .withMessage("Address alias is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Alias must be between 2 and 50 characters"),
      body("details")
        .notEmpty()
        .withMessage("Address details are required")
        .isLength({ min: 10, max: 200 })
        .withMessage("Details must be between 10 and 200 characters"),
      body("phone")
        .notEmpty()
        .withMessage("Phone number is required")
        .matches(/^[+]?[1-9][\d]{0,15}$/)
        .withMessage("Invalid phone number format"),
      body("city")
        .notEmpty()
        .withMessage("City is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("City must be between 2 and 50 characters"),
      body("postalCode")
        .notEmpty()
        .withMessage("Postal code is required")
        .isLength({ min: 3, max: 10 })
        .withMessage("Postal code must be between 3 and 10 characters"),
      body("isDefault")
        .optional()
        .isBoolean()
        .withMessage("isDefault must be a boolean value"),
    ],
  },
  removeAddress: {
    handler: expressAsyncHandler(removeAddressHandler),
    validator: [
      param("addressId").isMongoId().withMessage("Invalid address ID"),
      validatorMiddleware,
    ],
  },
  getAddresses: {
    handler: expressAsyncHandler(getAddressesHandler),
    validator: [],
  },
  getAddress: {
    handler: expressAsyncHandler(getAddressHandler),
    validator: [
      param("addressId").isMongoId().withMessage("Invalid address ID"),
      validatorMiddleware,
    ],
  },
};

export default AddressC;
