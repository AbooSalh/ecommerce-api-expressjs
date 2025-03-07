import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { categoryService } from "./service";

export const categoryController = {
  // @desc    Get all categories
  // @route   GET /api/categories
  // @access  Public
  getAll: expressAsyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const result = await categoryService.getAllCategories(page);
    res.status(200).json({ status: "success", data: result });
  }),
  // @desc    Get one category
  // @route   GET /api/categories/:id
  // @access  Public
  getOne: expressAsyncHandler(async (req: Request, res: Response) => {
    const title = req.params.title as string;
    const category = await categoryService.getCategoryByTitle(title);
    res.status(200).json({ status: "success", data: category });
  }),
  // @desc    Create a new category
  // @route   POST /api/categories
  // @access  Private
  create: expressAsyncHandler(async (req: Request, res: Response) => {
    const { title, image } = req.body;
    const newCategory = await categoryService.createCategory({
      title,
      image,
    });

    res.status(201).json({ status: "success", data: newCategory });
  }),
  // @desc    Update a category
  // @route   PUT /api/categories/:id
  // @access  Private
  update: expressAsyncHandler(async (req: Request, res: Response) => {
    const title = req.params.title as string;
    const updatedData = req.body;
    const category = await categoryService.updateCategory(title, updatedData);
    res.status(200).json({ status: "success", data: category });
  }),
  // @desc    Delete a category
  // @route   DELETE /api/categories/:id
  // @access  Private
  delete: expressAsyncHandler(async (req: Request, res: Response) => {
    const title = req.params.title as string;
    const category = await categoryService.deleteCategory(title);
    res.status(200).json({ status: "success", data: category });
  }),
};
