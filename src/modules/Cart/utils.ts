import { ICart } from "./model";
import ProductM, { IStock } from "../Product/model";
import mongoose from "mongoose";

export const calcTotalPrice = (cart: ICart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    // If discount is present, apply it as a percentage off the price
    const discount = item.discount; // fallback if discount is not present
    const priceAfterDiscount = item.price * (1 - discount / 100);
    totalPrice += priceAfterDiscount * item.quantity;
  });
  cart.totalPriceAfterDiscount = totalPrice; // Assuming no further cart-level discount
  return totalPrice;
};

/**
 * Checks if a product with the given color, size, and requested quantity is available to order.
 * @param productId - The product's ObjectId or string
 * @param color - The color to check
 * @param size - The size to check
 * @param requestedQty - The quantity user wants to order
 * @param maxOrderQty - The maximum allowed per order (default 10)
 * @returns true if available and allowed, false otherwise
 */
export const checkAvailability = async (
  productId: mongoose.Schema.Types.ObjectId | string,
  color: string,
  size: string,
  requestedQty: number,
  maxOrderQty = 10
): Promise<boolean> => {
  const product = await ProductM.findById(productId).lean();
  if (!product || !Array.isArray(product.stocks)) return false;
  const stock = product.stocks.find(
    (s: IStock) => s.color === color && s.size === size
  );
  if (!stock) return false;
  if (requestedQty > stock.quantity) return false;
  if (requestedQty > maxOrderQty) return false;
  return true;
};
