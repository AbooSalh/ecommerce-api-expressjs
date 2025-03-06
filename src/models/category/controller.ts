import { Request, Response } from "express";
import expressAsyncHandler from "express-async-handler";
import { categoryService } from "./service";

export const categoryController = {
  // @desc    Get all categories
  // @route   GET /api/categories
  // @access  Public
  getAll: expressAsyncHandler(async (req: Request, res: Response) => {
    // pagination
    const page = parseInt(req.query.page as string) || 1;
    const result = await categoryService.getAllCategories(page);
    res.status(200).json({ success: true, data: result });
  }),

  // @desc    Create a new category
  // @route   POST /api/categories
  // @access  Private
  createCategory: expressAsyncHandler(async (req: Request, res: Response) => {
    const { name, slug, image } = req.body;

    try {
      const newCategory = await categoryService.createCategory({
        name,
        slug,
        image,
      });

      res.status(201).json({ success: true, data: newCategory });
    } catch (error: any) {
      res.status(400).json({ success: false, error: error.message });
    }
  }),
};
