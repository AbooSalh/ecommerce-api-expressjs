import ApiError from "@/common/utils/api/ApiError";
import CartM from "../Cart/model";
import UserM, { IUser, IUserAddress } from "../User/model";
import { IUserId } from "../Cart/service";
import ProductM from "../Product/model";
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
  let shippingAddress: IUserAddress | undefined;
  if (addressId) {
    shippingAddress = user.addresses?.find(
      (addr: IUserAddress) => addr._id.toString() === addressId.toString()
    );
    if (!shippingAddress) {
      throw new ApiError("Address not found", "NOT_FOUND");
    }
  } else {
    shippingAddress = user.addresses?.find(
      (addr: IUserAddress) => addr.isDefault
    );
    if (!shippingAddress) {
      throw new ApiError("No default address found", "NOT_FOUND");
    }
  }
  //   get Order Price
  const cartPrice = cart.totalPrice;
  const totalOrderPrice = cartPrice + taxPrice + shippingPrice;
  //   create order
  const order = await CartM.create({
    user: userId,
    cart: cart._id,
    taxPrice,
    shippingPrice,
    shippingAddress,
    totalOrderPrice,
    paymentMethod: "cod", // Cash on delivery
    isPaid: false, // Assuming cash orders are paid immediately
  });
  //   after creating order , decrement product stock , increment sold count
  const bulkOptions = cart.cartItems.map((item) => ({
    updateOne: {
      filter: { _id: item.product },
      update: { $inc: { quantity: -item.quantity, sold: item.quantity } },
    },
  }));
  await ProductM.bulkWrite(bulkOptions, {});
  //   clear cart
  return order;
};
const OrderS = {
  createCashOrder,
};
export default OrderS;
