import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { categoryS as s } from "./services";
import ApiSuccess from "@/common/utils/api/ApiSuccess";
import validatorMiddleware from "@/common/middleware/validators/validator";
import { body, param, oneOf } from "express-validator";

export const categoryC = {
  // @desc    Get all categories
  // @route   GET /api/categories
  // @access  Public
  getAll: {
    handler: expressAsyncHandler(async (req: Request, res: Response) => {
      const result = await s.getAll(req.body);
      ApiSuccess.send(res, "OK", "Categories found", result);
    }),
    validator: [
      // rules
      body("title").exists().withMessage("Category title is required"),
      body("image").exists().withMessage("Category image is required"),
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
      const { categorySlug } = req.params;
      const category = await s.getOne(categorySlug);
      ApiSuccess.send(res, "OK", "Category found", category);
    }),
    validator: [],
  },
  // @desc    Create a new category
  // @route   POST /api/categories
  // @access  Private
  create: {
    handler: expressAsyncHandler(async (req: Request, res: Response) => {
      const { title, image } = req.body;
      const newCategory = await s.create({
        title,
        image,
      });
      ApiSuccess.send(res, "CREATED", "Category created", newCategory);
    }),
    validator: [
      // rules
      param("categorySlug").exists().withMessage("Category title is required"),
      // middleware catch
      validatorMiddleware,
    ],
  },
  // @desc    Update a category
  // @route   PUT /api/categories/:id
  // @access  Private
  update: {
    handler: expressAsyncHandler(async (req: Request, res: Response) => {
      const { categorySlug } = req.params;
      const updatedData = req.body;
      const category = await s.update(categorySlug, updatedData);
      ApiSuccess.send(res, "OK", "Category updated", category);
    }),
    validator: [
      // rules
      // at least one exists
      param("categorySlug").exists().withMessage("Category title is required"),
      body("title")
        .isLength({ min: 3, max: 32 })
        .withMessage("Category title is too short at least 3 characters"),
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
      const { categorySlug } = req.params;
      const category = await s.delete(categorySlug);
      ApiSuccess.send(res, "OK", "Category deleted", category);
    }),
    validator: [
      // rules
      param("categorySlug").exists().withMessage("Category title is required"),
      // middleware catch
      validatorMiddleware,
    ],
  },
};
