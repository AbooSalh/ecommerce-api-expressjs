/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import ApiSuccess from "@/common/utils/api/ApiSuccess";
import expressAsyncHandler from "express-async-handler";
import { Model } from "mongoose";
import baseServices from "../services";
import validatorMiddleware from "@/common/middleware/validators/validator";
import { body, oneOf, param } from "express-validator";
import generateValidator from "@/common/utils/validatorsGenerator";

export default function baseControllers(
  model: Model<any>,
  excludeData: string[] = []
) {
  const s = baseServices(model);
  excludeData.push("slug");
  const updatableFields = Object.keys(model.schema.paths).filter(
    (key) =>
      !excludeData.includes(key) &&
      key !== "_id" &&
      key !== "__v" &&
      !key.includes(".")
  );

  return {
    deleteOne: {
      handler: expressAsyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await s.deleteOne(id);
        ApiSuccess.send(res, "OK", "document deleted", result);
      }),
      validator: [
        param("id").exists().withMessage("id is required").isMongoId(),
        validatorMiddleware,
      ],
    },
    update: {
      handler: expressAsyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const updatedData = req.body;
        const result = await s.update(id, updatedData, excludeData);
        ApiSuccess.send(res, "OK", "document updated", result);
      }),
      validator: [
        param("id").exists().withMessage("id is required").isMongoId(),
        oneOf(
          updatableFields.map((field) =>
            body(field).exists().withMessage(`${field} must be provided`)
          ),
          {
            message: "At least one valid field must be provided to update", // Fix here: message should be in options
          }
        ),
        ...generateValidator(model, excludeData, "update"),
        validatorMiddleware,
      ],
    },
    create: {
      handler: expressAsyncHandler(async (req: Request, res: Response) => {
        const data = req.body;
        const result = await s.create(data, excludeData);
        ApiSuccess.send(res, "CREATED", "document created", result);
      }),
      validator: [
        ...generateValidator(model, excludeData, "create"),
        validatorMiddleware,
      ],
    },
    getOne: {
      handler: expressAsyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const result = await s.getOne(id);
        ApiSuccess.send(res, "OK", "document found", result);
      }),
      validator: [
        param("id").exists().withMessage("id is required").isMongoId(),
        validatorMiddleware,
      ],
    },
    getAll: {
      handler: expressAsyncHandler(async (req: Request, res: Response) => {
        const result = await s.getAll(req.body);
        ApiSuccess.send(res, "OK", "documents found", result);
      }),
      validator: [
        param("page").optional().isInt().withMessage("Page must be an integer"),
        param("limit")
          .optional()
          .isInt()
          .withMessage("Limit must be an integer"),
        validatorMiddleware,
      ],
    },
  };
}
