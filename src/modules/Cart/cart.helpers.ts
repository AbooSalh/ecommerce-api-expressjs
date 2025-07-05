import ApiError from "@/common/utils/api/ApiError";
import { checkAvailability } from "./utils";
import type { ICartItem } from "./model";
import { ObjectId } from "mongoose";

/**
 * Checks if a cart item is available (stock and max order limit).
 * Throws ApiError if not available.
 */
export async function assertCartItemAvailable(
  cartItem: ICartItem,
  totalQuantity: number
) {
  const isAvailable = await checkAvailability(
    cartItem.product,
    cartItem.color,
    cartItem.size,
    totalQuantity
  );
  if (!isAvailable) {
    throw new ApiError(
      "Requested quantity not available for this product/variant or exceeds max allowed per order",
      "BAD_REQUEST"
    );
  }
}

/**
 * Updates or adds a cart item in the cartItems array.
 * Returns a tuple: [updatedCartItems, message]
 */
export function upsertCartItem(
  cartItems: ICartItem[],
  cartItem: ICartItem
): [ICartItem[], string] {
  const idx = cartItems.findIndex(
    (item) =>
      item.product.toString() === cartItem.product.toString() &&
      item.color === cartItem.color &&
      item.size === cartItem.size
  );
  if (idx > -1) {
    cartItems[idx].quantity += cartItem.quantity;
    return [cartItems, "Product quantity updated in cart"];
  } else {
    cartItems.push(cartItem);
    return [cartItems, "Product added to cart"];
  }
}

/**
 * Updates the quantity of a cart item (by product/color/size).
 * Throws if not found.
 */
export function setCartItemQuantity(
  cartItems: ICartItem[],
  productId: ObjectId | string,
  color: string,
  size: string,
  quantity: number
): ICartItem[] {
  const idx = cartItems.findIndex(
    (item) =>
      item.product.toString() === productId.toString() &&
      item.color === color &&
      item.size === size
  );
  if (idx === -1) throw new ApiError("Product not found in cart", "NOT_FOUND");
  cartItems[idx].quantity = quantity;
  return cartItems;
}

/**
 * Removes a cart item by productId.
 */
export function removeCartItem(
  cartItems: ICartItem[],
  productId: ObjectId | string
): ICartItem[] {
  return cartItems.filter(
    (item) => item.product.toString() !== productId.toString()
  );
}
