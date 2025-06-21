import type mongoose from "mongoose";
import CartM, { ICartItem } from "./model";
import ProductM from "../Product/model";
import ApiError from "@/common/utils/api/ApiError";
import { calcTotalPrice } from "./utils";
import {
  assertCartItemAvailable,
  upsertCartItem,
  setCartItemQuantity,
  removeCartItem,
} from "./cart.helpers";

export type IUserId = mongoose.Schema.Types.ObjectId | string;
type IProductId = mongoose.Schema.Types.ObjectId | string;

const addProductToCart = async (
  userId: IUserId,
  cartItem: ICartItem
): Promise<{ document: mongoose.Document; message: string }> => {
  let message = "";
  const product = await ProductM.findById(cartItem.product);
  if (!product) {
    throw new ApiError("Product not found", "NOT_FOUND");
  }
  // Always set price and discount from product, not client
  const cartItemWithPrice = {
    ...cartItem,
    price: product.price,
    discount: product.discount,
  };
  let cart = await CartM.findOne({ user: userId });
  if (!cart) {
    await assertCartItemAvailable(
      cartItemWithPrice,
      cartItemWithPrice.quantity
    );
    cart = await CartM.create({
      user: userId,
      cartItems: [cartItemWithPrice],
    });
    message = "Product added to new cart";
  } else {
    const idx = cart.cartItems.findIndex(
      (item) =>
        item.product.toString() === cartItem.product.toString() &&
        item.color === cartItem.color &&
        item.size === cartItem.size
    );
    let newQuantity = cartItemWithPrice.quantity;
    if (idx > -1) {
      newQuantity =
        (cart.cartItems[idx].quantity ?? 0) + cartItemWithPrice.quantity;
    }
    await assertCartItemAvailable(cartItemWithPrice, newQuantity);
    const [updatedItems, msg] = upsertCartItem(
      cart.cartItems,
      cartItemWithPrice
    );
    cart.cartItems = updatedItems;
    message = msg;
  }
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
  cart.cartItems = removeCartItem(cart.cartItems, productId);
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
  // Always set price and discount from product
  const product = await ProductM.findById(productId);
  if (!product) {
    throw new ApiError("Product not found", "NOT_FOUND");
  }
  await assertCartItemAvailable(
    {
      product: productId,
      color,
      size,
      quantity,
      price: product.price,
      discount: product.discount,
    } as ICartItem,
    quantity
  );
  cart.cartItems = setCartItemQuantity(
    cart.cartItems,
    productId,
    color,
    size,
    quantity
  );
  // Update price and discount for the updated item
  const idx = cart.cartItems.findIndex(
    (item) =>
      item.product.toString() === productId.toString() &&
      item.color === color &&
      item.size === size
  );
  if (idx > -1) {
    cart.cartItems[idx].price = product.price;
    cart.cartItems[idx].discount = product.discount;
  }
  cart.totalPrice = calcTotalPrice(cart);
  await cart.save();
  return { document: cart, message: "Product quantity updated in cart" };
};

export const CartS = {
  addProductToCart,
  getCart,
  removeItemFromCart,
  clearCart,
  updateCartItemQuantity,
};
export default CartS;
