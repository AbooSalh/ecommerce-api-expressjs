import type { Request, Response } from "express";
import CategoryModel from "./model";
import slugify from "slugify";

interface CreateCategory {
  name: string;
  slug: string;
}

export function getCategories(_req: Request, res: Response) {
  res.send("lol");
}

export function createCategory(
  req: Request<{}, {}, CreateCategory>,
  res: Response
) {
  const { name, slug } = req.body;
  CategoryModel.create({ name, slug: slugify(slug) })
  .then((category) => res.status(201).json({ data: category }))
  .catch((err) => res.status(400).send(err));
}
