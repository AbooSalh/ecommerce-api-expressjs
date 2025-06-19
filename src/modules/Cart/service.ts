import type mongoose from "mongoose";
import CartM, { ICart, ICartItem } from "./model";
import ProductM from "../Product/model";
import ApiError from "@/common/utils/api/ApiError";

type IUserId = mongoose.Schema.Types.ObjectId | string;
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

const calcTotalPrice = (cart: ICart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });
  return totalPrice;
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
export const CartS = {
  addProductToCart,
  getCart,
  removeItemFromCart,
  clearCart,
  updateCartItemQuantity,
};
export default CartS;
