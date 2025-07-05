import ApiSuccess from "@/common/utils/api/ApiSuccess";
import UserModel from "../model";
import { RequestHandler } from "express";
import ApiError from "@/common/utils/api/ApiError";
import ProductM from "../../Product/model";
import { body } from "express-validator";
import expressAsyncHandler from "express-async-handler";

const addToWishlistHandler: RequestHandler = async (req, res, next) => {
  const { productId } = req.body;
  const product = await ProductM.findById(productId);
  if (!product) {
    return next(new ApiError("Product not found", "NOT_FOUND"));
  }
  const user = await UserModel.findByIdAndUpdate(req.user?._id, {
    $addToSet: { wishlist: productId },
  });
  if (!user) {
    return next(new ApiError("User not found", "NOT_FOUND"));
  }
  return ApiSuccess.send(res, "OK", "product added to wishlist", user);
};
const removeFromWishlistHandler: RequestHandler = async (req, res, next) => {
  const { productId } = req.body;
  const product = await ProductM.findById(productId);
  if (!product) {
    return next(new ApiError("Product not found", "NOT_FOUND"));
  }
  const user = await UserModel.findByIdAndUpdate(req.user?._id, {
    $pull: { wishlist: productId },
  });
  if (!user) {
    return next(new ApiError("User not found", "NOT_FOUND"));
  }
  return ApiSuccess.send(res, "OK", "product removed from wishlist", user);
};
const getWishlistHandler: RequestHandler = async (req, res, next) => {
  const user = await UserModel.findById(req.user?._id).populate("wishlist");
  if (!user) {
    return next(new ApiError("User not found", "NOT_FOUND"));
  }
  return ApiSuccess.send(res, "OK", "wishlist", user.wishlist);
};

const WishlistC = {
  addToWishlist: {
    handler: expressAsyncHandler(addToWishlistHandler),
    validator: [
      body("productId")
        .isMongoId()
        .withMessage("Invalid product id")
        .notEmpty()
        .withMessage("Product id is required"),
    ],
  },
  removeFromWishlist: {
    handler: expressAsyncHandler(removeFromWishlistHandler),
    validator: [
      body("productId")
        .isMongoId()
        .withMessage("Invalid product id")
        .notEmpty()
        .withMessage("Product id is required"),
    ],
  },
  getWishlist: {
    handler: expressAsyncHandler(getWishlistHandler),
    validator: [],
  },
};

export default WishlistC;
