import mongoose from "mongoose";

type ISize = "xs" | "s" | "m" | "l" | "xl" | "xxl";
export type ICartItem = {
  product: mongoose.Schema.Types.ObjectId ;
  quantity: number;
  color: string;
  size: ISize;
  price: number;
  discount: number; // Optional, if discounts are not always applied
};
export type ICart = {
  user: mongoose.Schema.Types.ObjectId;
  cartItems: ICartItem[];
  totalPrice: number; // Optional, if total price is not always calculated
  totalPriceAfterDiscount?: number; // Optional, if discounts are not always applied
};
const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product is required"],
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity cannot be less than 1"],
          max: [10, "Quantity cannot be more than 10"],
          default: 1,
        },
        price: {
          type: Number,
          required: true,
          min: [0, "Price cannot be less than 0"],
        },
        color: {
          type: String,
          required: true,
          trim: true,
        },
        size: {
          required: true,
          type: String,
          enum: ["xs", "s", "m", "l", "xl", "xxl"],
        },
        discount: {
          type: Number,
          default: 0,
        },
      },
    ],

    totalPrice: Number,
    totalPriceAfterDiscount: Number,
  },
  {
    timestamps: true,
  }
);

const CartM = mongoose.model<ICart>("Cart", cartSchema);
export default CartM;
