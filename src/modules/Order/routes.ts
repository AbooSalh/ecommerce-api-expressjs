import express from "express";
const OrderR = express.Router();
import { OrderC as c } from "./controller";
import authMiddleware from "@/common/middleware/auth";
OrderR.route("/").post(
  authMiddleware("user"),
  c.createCashOrder.validator,
  c.createCashOrder.handler
);

export default OrderR;
