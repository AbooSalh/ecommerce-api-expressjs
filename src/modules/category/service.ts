import slugify from "slugify";
import Category from "./model";

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
    const category = await Category.find({ title });
    return category;
  },
  // Create a new category
  createCategory: async (categoryData: CreateCategory) => {
    const { title, image } = categoryData;
    console.log(title);
    
    const category = await Category.create({
      title,
      slug: slugify(title, { lower: true }),
      image,
    });
    return category;
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

    const category = await Category.findOneAndUpdate(
      { title: title },
      { $set: updatedData },
      { new: true, runValidators: true } // Ensures validation runs on update
    );

    return category;
  },
  // Delete a category
  deleteCategory: async (title: string) => {
    const category = await Category.findOneAndDelete({ title });
    return category;
  },
};
