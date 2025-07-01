import ApiError from "@/common/utils/api/ApiError";
import CartM from "../Cart/model";
import UserM, { IUser } from "../User/model";
import { IUserId } from "../Cart/service";
import ProductM from "../Product/model";
import { getShippingAddress } from "./utils";
import OrderM from "./model";
import Stripe from "stripe";
import dotenv from "dotenv";
import dotenvExpand from "dotenv-expand";
import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import ApiSuccess from "@/common/utils/api/ApiSuccess";
const taxPrice = 0; // Assuming a fixed tax price for simplicity
const shippingPrice = 0; // Assuming a fixed shipping price for simplicity
dotenvExpand.expand(dotenv.config());

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
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-05-28.basil",
});
const checkoutSession = async (
  userId: IUserId,
  addressId: string,
  req: { protocol: string; secure: boolean; host: string } // Use 'any' to avoid TS error for protocol, or import { Request } from 'express'
): Promise<Stripe.Response<Stripe.Checkout.Session>> => {
  const cart = await CartM.findOne({ user: userId });
  if (!cart) {
    throw new ApiError("Cart not found for user", "NOT_FOUND");
  }
  const user = (await UserM.findById(userId)) as IUser;
  if (!user) {
    throw new ApiError("User not found", "NOT_FOUND");
  }
  // Use req.protocol if available, else fallback to http
  const protocol = req.protocol || (req.secure ? "https" : "http");
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: user.name, // or use a product/cart description
          },
          unit_amount: Math.round(cart.totalPrice * 100), // Stripe expects an integer
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${protocol}://${req.host}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${protocol}://${req.host}/cancel`,
    customer_email: user.email,
    client_reference_id: userId.toString(), // Store user ID for later reference
    metadata: {
      userId: userId.toString(),
      addressId: getShippingAddress(user, addressId)._id.toString(), // Store address ID
    },
  });
  console.log("[checkoutSession] Stripe session created:", session.id);
  return session;
};
export const webHookCheckout = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"];
    if (!sig || typeof sig !== "string") {
      throw new ApiError("Stripe signature header missing", "BAD_REQUEST");
    }
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!endpointSecret) {
      throw new ApiError("Endpoint secret not found", "NOT_FOUND");
    }
    let event;
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch {
      throw new ApiError("Invalid signature", "UNAUTHORIZED");
    }

    if (event.type === "checkout.session.completed") {
      try {
        await createCardOrder(event.data.object as Stripe.Checkout.Session);
      } catch {
        // Optionally handle error
        throw new ApiError(
          "Failed to create order from checkout session",
          "INTERNAL_SERVER_ERROR"
        );
      }
    }
    ApiSuccess.send(
      res,
      "OK",
      "Order created successfully",
      event.data.object as Stripe.Checkout.Session
    );
  }
);
const createCardOrder = async (session: Stripe.Checkout.Session) => {
  // Extract userId and addressId from session metadata
  // check nullity
  if (
    !session.client_reference_id ||
    !session.metadata?.addressId ||
    session.amount_total == null
  ) {
    throw new ApiError(
      "User ID or address ID not found in session metadata",
      "BAD_REQUEST"
    );
  }
  const userId = session.client_reference_id as IUserId;
  const addressId = session.metadata?.addressId;
  // const orderPrice = session.amount_total / 100; // Convert from cents to dollars
  if (!addressId) {
    throw new ApiError(
      "Address ID not found in session metadata",
      "BAD_REQUEST"
    );
  }
  if (!userId) {
    throw new ApiError("User ID not found in session metadata", "BAD_REQUEST");
  }

  // Create a cash order using the session details
    const order = await createCashOrder(userId, addressId);
    order.paymentMethod = "card"; // Update payment method to card
    await order.save();
    // Update the order to paid
    await updateOrderToPaid(order._id.toString());
    return order;
  
};
const OrderS = {
  createCashOrder,
  updateOrderToPaid,
  updateOrderToDelivered,
  checkoutSession,
};
export default OrderS;
