import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "Coupon name is required"],
    unique: true,
  },
  expire: {
    type: Date,
    required: [true, "Coupon expire date is required"],
  },
  quantity: {
    type: Number,
    required: [true, "Coupon quantity is required"],
  },
  discount: {
    type: Number,
    required: [true, "Coupon discount is required"],
  },
  },
  { timestamps: true }
);

const CouponM = mongoose.model("Coupon", couponSchema);

export default CouponM;