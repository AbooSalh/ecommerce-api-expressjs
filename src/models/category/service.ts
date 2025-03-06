import slugify from "slugify";
import CategoryModel from "./model";

interface CreateCategory {
  name: string;
  slug: string;
  image?: string;
}

// Get all categories
export async function getAllCategories(page = 1) {
  const limit = 5;
  const skip = (page - 1) * limit;
  const results = await CategoryModel.find({}).limit(limit).skip(skip);
  const data = {
    categories: results,
    currentPage: page,
    hasPrevPage: page > 1,
    hasNextPage: results.length === limit,
    lastPage: Math.ceil((await CategoryModel.countDocuments()) / limit),
  };
  return {
    success: true,
    data,
  };
}

// Create a new category
export async function createCategory(categoryData: CreateCategory) {
  const { name, slug, image } = categoryData;

  try {
    const category = await CategoryModel.create({
      name,
      slug: slugify(slug, { lower: true }),
      image,
    });

    return category;
  } catch (error: any) {
    console.error("Error creating category:", error);
    throw new Error(error.message || "Database error");
  }
}

export const categoryService = { getAllCategories, createCategory };
