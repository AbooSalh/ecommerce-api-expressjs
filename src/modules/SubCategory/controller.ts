import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import ApiSuccess from "@/common/utils/api/ApiSuccess";
import { subCategoryService as s } from "./services";

export const subCategoryC = {
  // @desc    Get all categories
  // @route   GET /api/categories
  // @access  Public
  getAll: {
    handler: expressAsyncHandler(async (req: Request, res: Response) => {
      const page = parseInt(req.query.page as string) || 1;
      const result = await s.getAll(page);
      ApiSuccess.send(res, "OK", "Sub Categories found", result);
    }),
    validator: [],
  },
  // @desc    Get one category
  // @route   GET /api/categories/:id
  // @access  Public
  getOne: {
    handler: expressAsyncHandler(async (req: Request, res: Response) => {
      const {title} = req.params 
      console.log(req.params);
      
      const category = await s.getOne(title);
      ApiSuccess.send(res, "OK", "Sub Category found", category);
    }),
    validator: [],
  },
  // @desc    Create a new category
  // @route   POST /api/categories
  // @access  Private
  create: {
    handler: expressAsyncHandler(async (req: Request, res: Response) => {
      const { title, image, categoryTitle } = req.body;
      const newCategory = await s.create({
        title,
        image,
        categoryTitle,
      });
      ApiSuccess.send(res, "CREATED", "Sub Category created", newCategory);
    }),
    validator: [],
  },
  // @desc    Update a category
  // @route   PUT /api/categories/:id
  // @access  Private
  update: {
    handler: expressAsyncHandler(async (req: Request, res: Response) => {
      const title = req.params.title as string;
      const updatedData = req.body;
      const category = await s.update(title, updatedData);
      ApiSuccess.send(res, "OK", "Sub Category updated", category);
    }),
    validator: [],
  },
  // @desc    Delete a category
  // @route   DELETE /api/categories/:id
  // @access  Private
  delete: {
    handler: expressAsyncHandler(async (req: Request, res: Response) => {
      const title = req.params.title as string;
      const category = await s.delete(title);
      ApiSuccess.send(res, "OK", "Sub Category deleted", category);
    }),
    validator: [],
  },
};
