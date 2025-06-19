import { Router } from "express";
import { CartC as c } from "./controller";
import authMiddleware from "@/common/middleware/auth";

const cartR = Router();

cartR.use(authMiddleware());
cartR.post("/", c.addProductToCart.validator, c.addProductToCart.handler);
cartR.get("/", c.getCart.handler);
cartR.delete(
  "/:id",
  c.removeItemFromCart.validator,
  c.removeItemFromCart.handler
);
cartR.delete("/", c.clearCart.handler);
cartR.put(
  "/:id",
  c.updateCartItemQuantity.validator,
  c.updateCartItemQuantity.handler
);

cartR.post("/coupon", c.applyCoupon.validator, c.applyCoupon.handler);

export default cartR;
