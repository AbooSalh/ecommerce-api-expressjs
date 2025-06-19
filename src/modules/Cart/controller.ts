import expressAsyncHandler from "express-async-handler";
import CartS from "./service";
import { RequestHandler } from "express";
import ApiSuccess from "@/common/utils/api/ApiSuccess";
import { ICartItem } from "./model";
import ApiError from "@/common/utils/api/ApiError";
import { body, param } from "express-validator";
import validatorMiddleware from "@/common/middleware/validators/validator";
import ProductM from "../Product/model";

const addProductToCartHandler: RequestHandler = async (req, res) => {
  const userId = req.user!._id;
  const cart = await CartS.addProductToCart(userId, req.body as ICartItem);
  return ApiSuccess.send(
    res,
    "OK",
    "Product added to cart - " + cart.message,
    cart.document
  );
};

const getCartHandler: RequestHandler = async (req, res) => {
  const userId = req.user!._id;
  const cart = await CartS.getCart(userId);
  return ApiSuccess.send(res, "OK", "Cart retrieved successfully", cart);
};
const removeItemFromCartHandler: RequestHandler = async (req, res) => {
  const userId = req.user!._id;
  const cart = await CartS.removeItemFromCart(userId, req.params.id);
  return ApiSuccess.send(
    res,
    "OK",
    "Product removed from cart - " + cart.message,
    cart.document
  );
};
const clearCartHandler: RequestHandler = async (req, res) => {
  const userId = req.user!._id;
  const cart = await CartS.clearCart(userId);
  return ApiSuccess.send(res, "OK", "Cart cleared successfully", cart);
};
const updateCartItemQuantityHandler: RequestHandler = async (req, res) => {
  const userId = req.user!._id;
  const cart = await CartS.updateCartItemQuantity(
    userId,
    req.params.id,
    req.body.quantity,
    req.body.color,
    req.body.size
  );
  return ApiSuccess.send(res, "OK", "Cart updated successfully", cart);
};
export const CartC = {
  addProductToCart: {
    handler: expressAsyncHandler(addProductToCartHandler),
    validator: [
      body("product")
        .isMongoId()
        .withMessage("Product ID must be a valid MongoDB ObjectId")
        .notEmpty()
        .withMessage("Product ID is required")
        .custom(async (value) => {
          // if productId is provided, check if product exists
          const product = await ProductM.findById(value);
          if (!product) {
            throw new ApiError("Product not found", "NOT_FOUND");
          }
        }),
      body("quantity")
        .isInt({ gt: 0 })
        .withMessage("Quantity must be greater than 0")
        .notEmpty()
        .withMessage("Quantity is required"),
      body("color")
        .optional()
        .isString()
        .withMessage("Color must be a string")
        .notEmpty()
        .withMessage("Color is required"),
      body("size")
        .optional()
        .isString()
        .withMessage("Size must be a string")
        .notEmpty()
        .withMessage("Size is required"),
      validatorMiddleware,
    ],
  },
  getCart: {
    handler: expressAsyncHandler(getCartHandler),
    validator: [],
  },
  removeItemFromCart: {
    handler: expressAsyncHandler(removeItemFromCartHandler),
    validator: [
      param("id")
        .isMongoId()
        .withMessage("Product ID must be a valid MongoDB ObjectId")
        .notEmpty()
        .withMessage("Product ID is required"),
    ],
  },
  clearCart: {
    handler: expressAsyncHandler(clearCartHandler),
    validator: [],
  },
  updateCartItemQuantity: {
    handler: expressAsyncHandler(updateCartItemQuantityHandler),
    validator: [
      param("id")
        .isMongoId()
        .withMessage("Product ID must be a valid MongoDB ObjectId")
        .notEmpty()
        .withMessage("Product ID is required"),
      body("quantity")
        .isInt({ gt: 0 })
        .withMessage("Quantity must be greater than 0")
        .notEmpty()
        .withMessage("Quantity is required"),
      body("color")
        .optional()
        .isString()
        .withMessage("Color must be a string")
        .notEmpty()
        .withMessage("Color is required"),
      body("size")
        .optional()
        .isString()
        .withMessage("Size must be a string")
        .notEmpty()
        .withMessage("Size is required"),
      validatorMiddleware,
    ],
  },
};
