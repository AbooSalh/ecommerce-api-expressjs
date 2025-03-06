import { Request, Response } from "express";
import { createCategoryService, getAllCategories } from "./service";

export async function getCategories(_req: Request, res: Response) {
  try {
    const categories = await getAllCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
}
export async function createCategory(req: Request, res: Response) {
  const { name, slug, image } = req.body;
  const result = await createCategoryService({ name, slug, image });
  res.send(result);
}
