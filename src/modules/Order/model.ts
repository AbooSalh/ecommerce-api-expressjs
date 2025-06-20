import mongoose from "mongoose";
type IOrder = {
  user: mongoose.Schema.Types.ObjectId;
  cart: mongoose.Schema.Types.ObjectId;
  taxPrice: number;
  shippingPrice: number;
  shippingAddress: {
    id: mongoose.Schema.Types.ObjectId;
    alias: string;
    details: string;
    phone: string;
    city: string;
    postalCode: string;
    isDefault: boolean;
  };
  totalOrderPrice: number;
  paymentMethod: string;
  isPaid: boolean;
  paidAt: Date;
  isDelivered: boolean;
  deliveredAt: Date;
};
const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    shippingAddress: {
      id: { type: mongoose.Schema.Types.ObjectId, required: true },
      alias: { type: String },
      details: { type: String },
      phone: { type: String },
      city: { type: String },
      postalCode: { type: String },
      isDefault: { type: Boolean, default: false },
    },
    totalOrderPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ["cod", "card"],
      default: "cod",
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: {
      type: Boolean,
      required: true,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const OrderM = mongoose.model<IOrder>("Order", OrderSchema);

export default OrderM;
