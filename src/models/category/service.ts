import slugify from "slugify";
import CategoryModel from "./model";

interface CreateCategory {
  name: string;
  slug: string;
  image?: string;
}

// Fetch all categories
export async function getAll() {
  return await CategoryModel.find();
}

// Create a new category
export async function createCategory(categoryData: CreateCategory) {
  const { name, slug, image } = categoryData;

  try {
    const category = await CategoryModel.create({
      name,
      slug: slugify(slug),
      image,
    });

    return category;
  } catch (error: any) {
    console.error("Error creating category:", error);

    throw new Error(error.message || "Database error");
  }
}

export const categoriesService = { getAll, createCategory };
