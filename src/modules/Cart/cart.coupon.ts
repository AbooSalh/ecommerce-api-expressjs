// import CouponM from "../Coupon/model";
// import ApiError from "@/common/utils/api/ApiError";
// import UserModel from "../User/model";
// import CartM from "./model";
// import { calcTotalPrice } from "./utils";
// import { IUserId } from "./service";

// export async function applyCouponToCart(userId: IUserId, couponCode: string) {
//   const coupon = await CouponM.findOne({
//     code: couponCode,
//     expire: { $gt: new Date() },
//     quantity: { $gt: 0 },
//   });
//   if (!coupon) {
//     throw new ApiError("Coupon not found or expired", "NOT_FOUND");
//   }
//   const user = await UserModel.findById(userId);
//   if (!user) {
//     throw new ApiError("User not found", "NOT_FOUND");
//   }
//   if (user.usedCoupons.includes(coupon._id)) {
//     throw new ApiError("You have already used this coupon", "CONFLICT");
//   }
//   const cart = await CartM.findOne({ user: userId });
//   if (!cart) {
//     throw new ApiError("Cart not found", "NOT_FOUND");
//   }
//   const totalPrice = cart.totalPrice || calcTotalPrice(cart);
//   const discountAmount = (totalPrice * coupon.discount) / 100;
//   cart.totalPriceAfterDiscount = parseInt(
//     (totalPrice - discountAmount).toFixed(2)
//   );
//   await cart.save();
//   await user.save();
//   return cart;
// }
