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
    return {
      success: true,
      data,
    };
  },
  // Get one category
  getCategoryByTitle: async (title: string) => {
    if (!title) {
      throw new ApiError("Category title is required", "BAD_REQUEST");
    }
    const category = await Category.find({ title });
    if (category.length === 0) {
      throw new ApiError("Category not found", "NOT_FOUND");
    }
    return category;
  },
  // Create a new category
  createCategory: async (categoryData: CreateCategory) => {
    const { title, image } = categoryData;
    const category = await Category.create({
      title,
      slug: slugify(title, { lower: true }),
      image,
    });
    return category;
  },
  // Update a category
  updateCategory: async (title: string, updatedData: CreateCategory) => {
    if (!title) {
      throw new ApiError("Category title is required", "BAD_REQUEST");
    }
    if (!updatedData) {
      throw new ApiError("Category data is required", "BAD_REQUEST");
    }
    // Generate a new slug only if the title is being updated
    if (updatedData.title) {
      updatedData = {
        ...updatedData,
        slug: slugify(updatedData.title, { lower: true }),
      };
    }

    const category = await Category.findOneAndUpdate(
      { title: title },
      { $set: updatedData },
      { new: true, runValidators: true } // Ensures validation runs on update
    );
    if (!category) {
      throw new ApiError("Category not found", "NOT_FOUND");
    }
    return category;
  },
  // Delete a category
  deleteCategory: async (title: string) => {
    if (!title) {
      throw new ApiError("Category title is required", "BAD_REQUEST");
    }
    const category = await Category.findOneAndDelete({ title });
    return category;
  },
};
