import slugify from "slugify";
import CategoryModel from "./model";

interface CreateCategory {
  name: string;
  slug: string;
  image?: string;
}

// Fetch all categories
export async function getAllCategories() {
  return await CategoryModel.find();
}

// Create a new category
export async function createCategoryService(categoryData: CreateCategory) {
  const { name, slug, image } = categoryData;

  try {
    const category = await CategoryModel.create({
      name,
      slug: slugify(slug),
      image,
    });
    return { success: true, data: category };
  } catch (error: any) {
    return { success: false, error };
  }
}
