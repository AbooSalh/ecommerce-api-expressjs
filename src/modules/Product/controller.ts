import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { productService as s } from "./service";
import ApiSuccess from "@/common/utils/api/ApiSuccess";
import validatorMiddleware from "@/common/middleware/validators/validator";
import { body, param, oneOf } from "express-validator";

export const productC = {
  // @desc    Get all products
  // @route   GET /api/products
  // @access  Public
  getAll: {
    handler: expressAsyncHandler(async (req: Request, res: Response) => {
      const { page, limit } = req.query;
      const filters = req.body.filters || {};
      const result = await s.getAll(
        filters,
        +(page as string) || 1,
        +(limit as string) || 10
      );
      ApiSuccess.send(res, "OK", "Products found", result);
    }),
    validator: [
      param("page").optional().isInt().withMessage("Page must be an integer"),
      param("limit").optional().isInt().withMessage("Limit must be an integer"),
      validatorMiddleware,
    ],
  },
  // @desc    Get one product
  // @route   GET /api/products/:slug
  // @access  Public
  getOne: {
    handler: expressAsyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await s.getOne(id);
      ApiSuccess.send(res, "OK", "Product found", result);
    }),
    validator: [
      param("id").exists().withMessage("Product slug is required"),
      validatorMiddleware,
    ],
  },
  // @desc    Create a new product
  // @route   POST /api/products
  // @access  Private
  create: {
    handler: expressAsyncHandler(async (req: Request, res: Response) => {
      const result = await s.create(req.body);
      ApiSuccess.send(res, "CREATED", "Product created", result);
    }),
    validator: [
      body("title").exists().withMessage("Product title is required"),
      body("description")
        .exists()
        .withMessage("Product description is required"),
      body("quantity")
        .isInt({ min: 1 })
        .withMessage("Quantity must be at least 1"),
      body("price")
        .isFloat({ min: 0 })
        .withMessage("Price must be a positive number"),
      body("imageCover")
        .exists()
        .withMessage("Product image cover is required"),
      body("category").exists().withMessage("Product category is required"),
      validatorMiddleware,
    ],
  },
  // @desc    Update a product
  // @route   PUT /api/products/:slug
  // @access  Private
  update: {
    handler: expressAsyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
      const updatedData = req.body;
      const result = await s.update(id, updatedData);
      ApiSuccess.send(res, "OK", "Product updated", result);
    }),
    validator: [
      param("id").exists().withMessage("Product id is required"),
      oneOf([
        body("title")
          .exists()
          .withMessage("At least one field must be updated"),
        body("description")
          .exists()
          .withMessage("At least one field must be updated"),
        body("quantity")
          .exists()
          .withMessage("At least one field must be updated"),
        body("price")
          .exists()
          .withMessage("At least one field must be updated"),
        body("imageCover")
          .exists()
          .withMessage("At least one field must be updated"),
        body("category")
          .exists()
          .withMessage("At least one field must be updated"),
      ]),
      validatorMiddleware,
    ],
  },
  // @desc    Delete a product
  // @route   DELETE /api/products/:slug
  // @access  Private
  delete: {
    handler: expressAsyncHandler(async (req: Request, res: Response) => {
      const { id } = req.params;
      const result = await s.delete(id);
      ApiSuccess.send(res, "OK", "Product deleted", result);
    }),
    validator: [
      param("id").exists().withMessage("Product id is required"),
      validatorMiddleware,
    ],
  },
};
