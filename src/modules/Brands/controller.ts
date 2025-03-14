import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { brandS as s } from "./service";
import ApiSuccess from "@/common/utils/api/ApiSuccess";
import validatorMiddleware from "@/common/middleware/validators/validator";
import { body, param, oneOf } from "express-validator";

export const brandC = {
  // @desc    Get all categories
  // @route   GET /api/categories
  // @access  Public
  getAll: {
    handler: expressAsyncHandler(async (req: Request, res: Response) => {
      const { page, limit } = req.params;
      const result = await s.getAll(+page, +limit);
      ApiSuccess.send(res, "OK", "Brands found", result);
    }),
    validator: [
      // rules
      param("page").isInt().withMessage("Page must be an integer"),
      param("limit").isInt().withMessage("Limit must be an integer"),
      // middleware catch
      validatorMiddleware,
    ],
  },
  // @desc    Get one category
  // @route   GET /api/categories/:id
  // @access  Public
  getOne: {
    handler: expressAsyncHandler(async (req: Request, res: Response) => {
      const { brandSlug } = req.params;
      const result = await s.getOne(brandSlug);
      ApiSuccess.send(res, "OK", "Brand found", result);
    }),
    validator: [],
  },
  // @desc    Create a new category
  // @route   POST /api/categories
  // @access  Private
  create: {
    handler: expressAsyncHandler(async (req: Request, res: Response) => {
      const { title, image } = req.body;
      const result = await s.create({
        title,
        image,
      });
      ApiSuccess.send(res, "CREATED", "Brand created", result);
    }),
    validator: [
      // rules
      body("title").exists().withMessage("brand title is required"),
      body("image").exists().withMessage("brand image is required"),
      // middleware catch
      validatorMiddleware,
    ],
  },
  // @desc    Update a category
  // @route   PUT /api/categories/:id
  // @access  Private
  update: {
    handler: expressAsyncHandler(async (req: Request, res: Response) => {
      const { brandSlug } = req.params;
      const updatedData = req.body;
      const result = await s.update(brandSlug, updatedData);
      ApiSuccess.send(res, "OK", "Brand updated", result);
    }),
    validator: [
      // rules
      // at least one exists
      param("brandSlug").exists().withMessage("brand title is required"),
      body("title")
        .isLength({ min: 3, max: 32 })
        .withMessage("brand title is too short at least 3 characters"),
      oneOf([
        body("title").exists().withMessage("at least update one value"),
        body("image").exists().withMessage("at least update one value"),
      ]),
      // middleware catch
      validatorMiddleware,
    ],
  },
  // @desc    Delete a category
  // @route   DELETE /api/categories/:id
  // @access  Private
  delete: {
    handler: expressAsyncHandler(async (req: Request, res: Response) => {
      const { brandSlug } = req.params;
      const result = await s.delete(brandSlug);
      ApiSuccess.send(res, "OK", "Brand deleted", result);
    }),
    validator: [
      // rules
      param("brandSlug").exists().withMessage("brand title is required"),
      // middleware catch
      validatorMiddleware,
    ],
  },
};
