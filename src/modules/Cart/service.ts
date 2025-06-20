import type mongoose from "mongoose";
import CartM, { ICartItem } from "./model";
import ProductM from "../Product/model";
import ApiError from "@/common/utils/api/ApiError";
import CouponM from "../Coupon/model";
import UserModel from "../User/model";
import { calcTotalPrice } from "./utils";

export type IUserId = mongoose.Schema.Types.ObjectId | string;
type IProductId = mongoose.Schema.Types.ObjectId | string;

const addProductToCart = async (
  userId: IUserId,
  cartItem: ICartItem
): Promise<{ document: mongoose.Document; message: string }> => {
  // get cart for user
  let message = "";
  const product = await ProductM.findById(cartItem.product);
  if (!product) {
    throw new ApiError("Product not found", "NOT_FOUND");
  }
  let cart = await CartM.findOne({ user: userId });
  if (!cart) {
    cart = await CartM.create({
      user: userId,
      cartItems: [
        {
          product: cartItem.product,
          quantity: cartItem.quantity,
          color: cartItem.color,
          size: cartItem.size,
          price: product.price, // Assuming price is taken from the product
        },
      ],
    });
    message = "Product added to new cart";
  } else {
    const productExists = cart.cartItems.findIndex(
      (item) =>
        item.product.toString() === cartItem.product.toString() &&
        item.color === cartItem.color &&
        item.size === cartItem.size
    );
    if (productExists > -1) {
      // if product exists, update quantity
      const product = cart.cartItems[productExists];
      product.quantity = (product.quantity ?? 0) + cartItem.quantity;
      cart.cartItems[productExists] = product;
      message = "Product quantity updated in cart";
    } else {
      // if product does not exist, add to cart
      cart.cartItems.push({
        product: cartItem.product,
        quantity: cartItem.quantity,
        color: cartItem.color,
        size: cartItem.size,
        price: product.price, // Assuming price is taken from the product
      });
      message = "Product added to cart";
    }
  }
  // recalculate total price
  cart.totalPrice = calcTotalPrice(cart);

  await cart.save();
  return { document: cart, message };
};

const getCart = async (userId: IUserId): Promise<mongoose.Document> => {
  const cart = await CartM.findOne({ user: userId });
  if (!cart) {
    throw new ApiError("Cart not found", "NOT_FOUND");
  }
  return cart;
};
const removeItemFromCart = async (userId: IUserId, productId: IProductId) => {
  const cart = await CartM.findOne({ user: userId });
  if (!cart) {
    throw new ApiError("Cart not found", "NOT_FOUND");
  }
  const productIndex = cart.cartItems.findIndex(
    (item) => item.product.toString() === productId.toString()
  );
  if (productIndex === -1) {
    throw new ApiError("Product not found in cart", "NOT_FOUND");
  }
  cart.cartItems.splice(productIndex, 1);
  // recalculate total price
  cart.totalPrice = calcTotalPrice(cart);
  await cart.save();
  return { document: cart, message: "Product removed from cart" };
};
const clearCart = async (userId: IUserId): Promise<mongoose.Document> => {
  const cart = await CartM.findOne({ user: userId });
  if (!cart) {
    throw new ApiError("Cart not found", "NOT_FOUND");
  }
  cart.cartItems = [];
  cart.totalPrice = 0;
  await cart.save();
  return cart;
};
const updateCartItemQuantity = async (
  userId: IUserId,
  productId: IProductId,
  quantity: number,
  color: string,
  size: string
) => {
  const cart = await CartM.findOne({ user: userId });
  if (!cart) {
    throw new ApiError("Cart not found", "NOT_FOUND");
  }
  const productIndex = cart.cartItems.findIndex(
    (item) =>
      item.product.toString() === productId.toString() &&
      item.color === color &&
      item.size === size
  );
  if (productIndex === -1) {
    throw new ApiError("Product not found in cart", "NOT_FOUND");
  }
  cart.cartItems[productIndex].quantity = quantity;
  // recalculate total price
  cart.totalPrice = calcTotalPrice(cart);
  await cart.save();
  return { document: cart, message: "Product quantity updated in cart" };
};
const applyCoupon = async (userId: IUserId, couponCode: string) => {
  const coupon = await CouponM.findOne({
    code: couponCode,
    expire: { $gt: new Date() },
    quantity: { $gt: 0 },
  });
  if (!coupon) {
    throw new ApiError("Coupon not found or expired", "NOT_FOUND");
  }

  //   Check if user has already used this coupon
  const user = await UserModel.findById(userId);
  if (!user) {
    throw new ApiError("User not found", "NOT_FOUND");
  }
  if (user.usedCoupons.includes(coupon._id)) {
    throw new ApiError("You have already used this coupon", "CONFLICT");
  }
  // use the coupon
  const cart = await CartM.findOne({ user: userId });
  if (!cart) {
    throw new ApiError("Cart not found", "NOT_FOUND");
  }
  const totalPrice = cart.totalPrice || calcTotalPrice(cart);
  //   calculate discount
  const discountAmount = (totalPrice * coupon.discount) / 100;
  cart.totalPriceAfterDiscount = parseInt(
    (totalPrice - discountAmount).toFixed(2)
  );
  await cart.save();
  await user.save();
  return cart;
};

export const CartS = {
  addProductToCart,
  getCart,
  removeItemFromCart,
  clearCart,
  updateCartItemQuantity,
  applyCoupon,
};
export default CartS;
