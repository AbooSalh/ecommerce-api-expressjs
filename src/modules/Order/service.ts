import ApiError from "@/common/utils/api/ApiError";
import CartM from "../Cart/model";
import UserM, { IUser } from "../User/model";
import { IUserId } from "../Cart/service";
import ProductM from "../Product/model";
import { getShippingAddress } from "./utils";
import OrderM from "./model";

const taxPrice = 0; // Assuming a fixed tax price for simplicity
const shippingPrice = 0; // Assuming a fixed shipping price for simplicity

const createCashOrder = async (userId: IUserId, addressId?: string) => {
  // get user's cart
  const cart = await CartM.findOne({ user: userId });
  if (!cart) {
    throw new ApiError("Cart not found for user", "NOT_FOUND");
  }
  // get user
  const user = (await UserM.findById(userId)) as IUser;
  if (!user) {
    throw new ApiError("User not found", "NOT_FOUND");
  }
  // get shipping address
  const shippingAddress = getShippingAddress(user, addressId);
  // Map _id to id for order schema
  const orderShippingAddress = {
    id: shippingAddress._id,
    ...shippingAddress,
  };
  //   get Order Price
  const cartPrice = cart.totalPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  //   create order (use OrderM, not CartM)
  const order = await OrderM.create({
    user: userId,
    cart: cart._id,
    cartItems: cart.cartItems, // snapshot of cart items
    taxPrice,
    shippingPrice,
    shippingAddress: orderShippingAddress,
    totalOrderPrice,
    paymentMethod: "cod", // Cash on delivery
    isPaid: false, // Assuming cash orders are paid immediately
  });
  //   after creating order , decrement product stock , increment sold count
  if (order) {
    const bulkOptions = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.product },
        update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
      },
    }));
    await ProductM.bulkWrite(bulkOptions, {});
    //   clear cart
    await CartM.deleteOne({ user: userId });
  }
  console.log("Order created successfully:", order);

  return order;
};
const updateOrderToPaid = async (orderId: string) => {
  // Find the order by ID and update the isPaid field to true
  const order = await OrderM.findByIdAndUpdate(
    orderId,
    { isPaid: true, paidAt: new Date() },
    { new: true }
  );
  if (!order) {
    throw new ApiError("Order not found", "NOT_FOUND");
  }
  return order;
};
const updateOrderToDelivered = async (orderId: string) => {
  // Find the order by ID and update the isDelivered field to true
  const order = await OrderM.findByIdAndUpdate(
    orderId,
    { isDelivered: true, deliveredAt: new Date() },
    { new: true }
  );
  if (!order) {
    throw new ApiError("Order not found", "NOT_FOUND");
  }
  return order;
};
const OrderS = {
  createCashOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
};
export default OrderS;
