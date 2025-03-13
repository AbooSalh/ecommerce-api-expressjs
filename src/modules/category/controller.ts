import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { categoryService } from "./services";
import ApiSuccess from "@/common/utils/api/ApiSuccess";

export const categoryController = {
  // @desc    Get all categories
  // @route   GET /api/categories
  // @access  Public
  getAll: expressAsyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const result = await categoryService.getAll(page);
    ApiSuccess.send(res, "OK", "Categories found", result);
  }),
  // @desc    Get one category
  // @route   GET /api/categories/:id
  // @access  Public
  getOne: expressAsyncHandler(async (req: Request, res: Response) => {
    const title = req.params.title as string;
    const category = await categoryService.getOne(title);
    ApiSuccess.send(res, "OK", "Category found", category);
  }),
  // @desc    Create a new category
  // @route   POST /api/categories
  // @access  Private
  create: expressAsyncHandler(async (req: Request, res: Response) => {
    const { title, image } = req.body;
    const newCategory = await categoryService.create({
      title,
      image,
    });
    ApiSuccess.send(res, "CREATED", "Category created", newCategory);
  }),
  // @desc    Update a category
  // @route   PUT /api/categories/:id
  // @access  Private
  update: expressAsyncHandler(async (req: Request, res: Response) => {
    const title = req.params.title as string;
    const updatedData = req.body;
    const category = await categoryService.update(title, updatedData);
    ApiSuccess.send(res, "OK", "Category updated", category);
  }),
  // @desc    Delete a category
  // @route   DELETE /api/categories/:id
  // @access  Private
  delete: expressAsyncHandler(async (req: Request, res: Response) => {
    const title = req.params.title as string;
    const category = await categoryService.delete(title);
    ApiSuccess.send(res, "OK", "Category deleted", category);
  }),
};
