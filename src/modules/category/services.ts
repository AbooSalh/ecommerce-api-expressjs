import Category from "./model";
import ApiError from "@/common/utils/api/ApiError";

interface CreateCategory {
  title: string;
  slug?: string;
  image?: string;
}

export const categoryService = {
  // Get all categories
  getAll: async (page = 1) => {
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
  getOne: async (slug: string) => {
    const data = await Category.findOne({ slug });
    if (!data) {
      throw new ApiError("Category not found", "NOT_FOUND");
    }
    return data;
  },
  // Create a new category
  create: async (categoryData: CreateCategory) => {
    const { title, image } = categoryData;
    const data = await Category.create({
      title,
      image,
    });
    return data;
  },
  // Update a category
  update: async (slug: string, updatedData: CreateCategory) => {
    const data = await Category.findOneAndUpdate(
      { slug },
      { $set: updatedData },
      { new: true, runValidators: true } // Ensures validation runs on update
    );
    if (!data) {
      throw new ApiError("Category not found", "NOT_FOUND");
    }
    return data;
  },
  // Delete a category
  delete: async (slug: string) => {
    const data = await Category.findOneAndDelete({slug});
    if (!data) {
      throw new ApiError("Category not found", "NOT_FOUND");
    }
    return data;
  },
};
