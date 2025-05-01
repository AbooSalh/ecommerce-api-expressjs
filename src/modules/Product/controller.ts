import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { productService as s } from "./service";
import ApiSuccess from "@/common/utils/api/ApiSuccess";
import validatorMiddleware from "@/common/middleware/validators/validator";
import { param } from "express-validator";

import baseController from "@/common/controllers/handlers";
import ProductM from "./model";
const { deleteOne, update, create } = baseController(ProductM, [
  "ratings",
  "sold",
  "ratingAvg",
]);
export const productC = {
  getAll: {
    handler: expressAsyncHandler(async (req: Request, res: Response) => {
      const result = await s.getAll(req.body);
      ApiSuccess.send(res, "OK", "Products found", result);
    }),
    validator: [
      param("page").optional().isInt().withMessage("Page must be an integer"),
      param("limit").optional().isInt().withMessage("Limit must be an integer"),
      validatorMiddleware,
    ],
  },

  getOne: {
    handler: expressAsyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await s.getOne(id);
      ApiSuccess.send(res, "OK", "Product found", result);
    }),
    validator: [
      param("id").exists().withMessage("Product slug is required").isMongoId(),
      validatorMiddleware,
    ],
  },
  create,
  update,
  deleteOne,
};
