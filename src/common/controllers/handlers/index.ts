/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import ApiSuccess from "@/common/utils/api/ApiSuccess";
import expressAsyncHandler from "express-async-handler";
import { Model } from "mongoose";
import baseServices from "../services";
import validatorMiddleware from "@/common/middleware/validators/validator";
import { param } from "express-validator";

export default function baseControllers(model: Model<any>) {
  const s = baseServices(model);
  return {
    deleteOne: {
      handler: expressAsyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await s.deleteOne(id);
        ApiSuccess.send(res, "OK", "Product deleted", result);
      }),
      validator: [
        param("id").exists().withMessage("id is required").isMongoId(),
        validatorMiddleware,
      ],
    },
    
  };
}
