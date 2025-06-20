import { ICart } from "./model";

export const calcTotalPrice = (cart: ICart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });
  cart.totalPriceAfterDiscount = totalPrice; // Assuming no discount applied initially
  return totalPrice;
};
