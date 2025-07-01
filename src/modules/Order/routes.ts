import express from "express";
const OrderR = express.Router();
import { OrderC as c } from "./controller";
import authMiddleware from "@/common/middleware/auth";
OrderR.route("/cod")
  .post(
    authMiddleware("user"),
    c.createCashOrder.validator,
    c.createCashOrder.handler
  )
  .get(authMiddleware("admin"), c.getAll.handler);
OrderR.route("/checkout-session").post(
  authMiddleware("user"),
  c.checkoutSession.validator,
  c.checkoutSession.handler
);
OrderR.route("/:id/pay").patch(
  authMiddleware("admin"),
  c.updateOrderToPaid.validator,
  c.updateOrderToPaid.handler
);
OrderR.route("/:id/deliver").patch(
  authMiddleware("admin"),
  c.updateOrderToDelivered.validator,
  c.updateOrderToDelivered.handler
);

export default OrderR;
