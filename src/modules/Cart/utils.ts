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
 * Checks if a product with the given color and size is available in stock.
 * @param productId - The product's ObjectId or string
 * @param color - The color to check
 * @param size - The size to check
 * @returns true if available, false otherwise
 */
export const isProductInStock = async (
  productId: mongoose.Types.ObjectId | string,
  color: string,
  size: string
): Promise<boolean> => {
  const product = await ProductM.findById(productId).lean();
  if (!product || !Array.isArray(product.stocks)) return false;
  return product.stocks.some(
    (stock: IStock) =>
      stock.color === color && stock.size === size && stock.quantity > 0
  );
};
