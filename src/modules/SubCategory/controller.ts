import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import ApiSuccess from "@/common/utils/api/ApiSuccess";
import { subCategoryService as s } from "./services";
import { body, param, oneOf } from "express-validator";
import validatorMiddleware from "@/common/middleware/validator";
export const subCategoryC = {
  // @desc    Get all categories
  // @route   GET /api/categories
  // @access  Public
  getAll: {
    handler: expressAsyncHandler(async (req: Request, res: Response) => {
      const { page, limit, categoryId } = req.params;
      let filters = {};
      if (categoryId) {
        filters = { category: categoryId };
      }
      const result = await s.getAll(filters, +page, +limit);
      ApiSuccess.send(res, "OK", "Sub Categories found", result);
    }),
    validator: [],
  },
  // @desc    Get one category
  // @route   GET /api/categories/:id
  // @access  Public
  getOne: {
    handler: expressAsyncHandler(async (req: Request, res: Response) => {
      const { subCategorySlug } = req.params;
      const category = await s.getOne(subCategorySlug);
      ApiSuccess.send(res, "OK", "Sub Category found", category);
    }),
    validator: [
      param("subCategorySlug")
        .exists()
        .withMessage("Sub Category title is required"),
      validatorMiddleware,
    ],
  },
  // @desc    Create a new category
  // @route   POST /api/categories
  // @access  Private
  create: {
    handler: expressAsyncHandler(async (req: Request, res: Response) => {
      const { title, image, categorySlug } = req.body;
      const newSubCategory = await s.create({
        title,
        image,
        categorySlug,
      });
      ApiSuccess.send(res, "CREATED", "Sub Category created", newSubCategory);
    }),
    validator: [
      body("title").exists().withMessage("Sub Category title is required"),
      body("image").exists().withMessage("Sub Category image is required"),
      body("categorySlug").exists().withMessage("Category title is required"),
      validatorMiddleware,
    ],
  },
  // @desc    Update a category
  // @route   PUT /api/categories/:id
  // @access  Private
  update: {
    handler: expressAsyncHandler(async (req: Request, res: Response) => {
      const { subCategorySlug } = req.params;
      const updatedData = req.body;
      const category = await s.update(subCategorySlug, updatedData);
      ApiSuccess.send(res, "OK", "Sub Category updated", category);
    }),
    validator: [
      param("subCategorySlug")
        .exists()
        .withMessage("Sub Category title is required"),
      oneOf([
        body("title").exists().withMessage("at least update one value"),
        body("image").exists().withMessage("at least update one value"),
        body("categorySlug").exists().withMessage("at least update one value"),
      ]),
      validatorMiddleware,
    ],
  },
  // @desc    Delete a category
  // @route   DELETE /api/categories/:id
  // @access  Private
  delete: {
    handler: expressAsyncHandler(async (req: Request, res: Response) => {
      const { subCategorySlug } = req.params;
      const category = await s.delete(subCategorySlug);
      ApiSuccess.send(res, "OK", "Sub Category deleted", category);
    }),
    validator: [
      param("subCategorySlug")
        .exists()
        .withMessage("Sub Category title is required"),
      validatorMiddleware,
    ],
  },
};
