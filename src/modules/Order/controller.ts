import ApiSuccess from "@/common/utils/api/ApiSuccess";
import OrderS from "./service";
import { RequestHandler } from "express";
import expressAsyncHandler from "express-async-handler";
import { body, param } from "express-validator";
import baseController from "@/common/controllers/handlers";
import OrderM from "./model";
import validatorMiddleware from "@/common/middleware/validators/validator";

const createCashOrderHandler: RequestHandler = async (req, res) => {
  const result = await OrderS.createCashOrder(
    req.user!._id,
    req.body.addressId
  );
  ApiSuccess.send(res, "OK", "Order created successfully", result);
};
const updateOrderToPaidHandler: RequestHandler = async (req, res) => {
  const result = await OrderS.updateOrderToPaid(req.params.id);
  ApiSuccess.send(res, "OK", "Order updated to paid successfully", result);
};
const updateOrderToDeliveredHandler: RequestHandler = async (req, res) => {
  const result = await OrderS.updateOrderToDelivered(req.params.id);
  ApiSuccess.send(res, "OK", "Order updated to delivered successfully", result);
};
const checkoutSessionHandler: RequestHandler = async (req, res) => {
  const session = await OrderS.checkoutSession(
    req.user!._id,
    req.body.addressId,
    {
      protocol: req.protocol,
      secure: req.secure,
      host: req.get("host") || req.hostname, // Use req.get("host") for compatibility
    }
  );
  ApiSuccess.send(res, "OK", "Checkout session created successfully", session);
};
export const OrderC = {
  createCashOrder: {
    handler: expressAsyncHandler(createCashOrderHandler),
    validator: [
      body("addressId")
        .optional()
        .isMongoId()
        .withMessage("Invalid address ID"),
    ],
  },
  getAll: { ...baseController(OrderM).getAll },

  updateOrderToPaid: {
    handler: expressAsyncHandler(updateOrderToPaidHandler),
    validator: [
      param("id")
        .isMongoId()
        .withMessage("Invalid order ID")
        .notEmpty()
        .withMessage("Order ID is required"),
      validatorMiddleware,
    ],
  },
  updateOrderToDelivered: {
    handler: expressAsyncHandler(updateOrderToDeliveredHandler),
    validator: [
      param("id")
        .isMongoId()
        .withMessage("Invalid order ID")
        .notEmpty()
        .withMessage("Order ID is required"),
      validatorMiddleware,
    ],
  },
  checkoutSession: {
    handler: expressAsyncHandler(checkoutSessionHandler),
    validator: [
      body("addressId")
        .optional()
        .isMongoId()
        .withMessage("Invalid address ID"),
      validatorMiddleware,
    ],
  },
};
export default OrderC;
