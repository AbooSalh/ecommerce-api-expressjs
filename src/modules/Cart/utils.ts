import { ICart } from "./model";

export const calcTotalPrice = (cart: ICart) => {
  let totalPrice = 0;
  cart.cartItems.forEach((item) => {
    // If discount is present, apply it as a percentage off the price
    console.log(item);
    const discount = item.discount; // fallback if discount is not present
    const priceAfterDiscount = item.price * (1 - discount / 100);
    totalPrice += priceAfterDiscount * item.quantity;
  });
  cart.totalPriceAfterDiscount = totalPrice; // Assuming no further cart-level discount
  return totalPrice;
};
