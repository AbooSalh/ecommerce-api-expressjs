import slugify from "slugify";
import Category from "./model";
import ApiError from "@/common/utils/ApiError";

interface CreateCategory {
  title: string;
  slug?: string;
  image?: string;
}

export const categoryService = {
  // Get all categories
  getAllCategories: async (page = 1) => {
    const limit = 5;
    const skip = (page - 1) * limit;
    const results = await Category.find({}).limit(limit).skip(skip);
    const data = {
      categories: results,
      currentPage: page,
      hasPrevPage: page > 1,
      hasNextPage: results.length === limit,
      lastPage: Math.ceil((await Category.countDocuments()) / limit),
    };
    return data;
  },
  // Get one category
  getCategoryByTitle: async (title: string) => {
    const data = await Category.find({ title });
    if (data.length === 0) {
      throw new ApiError("Category not found", "NOT_FOUND");
    }
    return data;
  },
  // Create a new category
  createCategory: async (categoryData: CreateCategory) => {
    const { title, image } = categoryData;
    const data = await Category.create({
      title,
      slug: slugify(title, { lower: true }),
      image,
    });
    return data;
  },
  // Update a category
  updateCategory: async (title: string, updatedData: CreateCategory) => {
    // Generate a new slug only if the title is being updated
    if (updatedData.title) {
      updatedData = {
        ...updatedData,
        slug: slugify(updatedData.title, { lower: true }),
      };
    }

    const data = await Category.findOneAndUpdate(
      { title: title },
      { $set: updatedData },
      { new: true, runValidators: true } // Ensures validation runs on update
    );
    if (!data) {
      throw new ApiError("Category not found", "NOT_FOUND");
    }
    return data;
  },
  // Delete a category
  deleteCategory: async (title: string) => {
    const data = await Category.findOneAndDelete({ title });
    return data;
  },
};
