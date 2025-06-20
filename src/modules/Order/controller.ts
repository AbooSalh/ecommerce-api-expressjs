import ApiSuccess from "@/common/utils/api/ApiSuccess";
import OrderS from "./service";
import { RequestHandler } from "express";
import expressAsyncHandler from "express-async-handler";
import { body } from "express-validator";

const createCashOrderHandler: RequestHandler = async (req, res) => {
  const result = await OrderS.createCashOrder(
    req.user!._id,
    req.body.addressId
  );
  ApiSuccess.send(res, "OK", "Order created successfully", result);
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
};
export default OrderC;
