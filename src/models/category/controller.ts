import { NextFunction, Request, Response } from "express";
import { categoriesService } from "./service";
import expressAsyncHandler from "express-async-handler";

export const categoryController = {
  getAll: expressAsyncHandler(async (_req: Request, res: Response) => {
    const categories = await categoriesService.getAll();
    res.json({ success: true, data: categories });
  }),

  createCategory: expressAsyncHandler(async (req: Request, res: Response) => {
    const { name, slug, image } = req.body;

    try {
      const result = await categoriesService.createCategory({
        name,
        slug,
        image,
      });

      res.status(201).json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({
        success: false,
        error: error.message || "Something went wrong",
      });
    }
  }),
};
