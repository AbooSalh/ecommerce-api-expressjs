import Category from "../Category/model";
import subCategory from "./model";
const model = subCategory;
import ApiError from "@/common/utils/api/ApiError";

interface ICreate {
  title: string;
  slug?: string;
  image?: string;
  categoryTitle: string;
}
interface IUpdate {
  title?: string;
  slug?: string;
  image?: string;
  categoryTitle?: string;
}
export const subCategoryService = {
  // Get all categories
  getAll: async (page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const results = await model.find({}).limit(limit).skip(skip);
    const data = {
      categories: results,
      currentPage: page,
      hasPrevPage: page > 1,
      hasNextPage: results.length === limit,
      lastPage: Math.ceil((await model.countDocuments()) / limit),
    };
    return data;
  },
  // Get one category
  getOne: async (title: string) => {
    const data = await model.findOne({ title });

    if ( !data) {
      throw new ApiError("Sub Category not found", "NOT_FOUND");
    }
    return data;
  },
  // Create a new category
  create: async (categoryData: ICreate) => {
    const { title, image, categoryTitle } = categoryData;
    const category = await Category.findOne({ title: categoryTitle });
    if (!category) {
      throw new ApiError("Category not found", "NOT_FOUND");
    }
    const data = await model.create({
      title,
      image,
      category,
    });
    return data;
  },
  // Update a category
  update: async (title: string, updatedData: IUpdate) => {
    const data = await model.findOneAndUpdate(
      { title: title },
      { $set: updatedData },
      { new: true, runValidators: true } // Ensures validation runs on update
    );
    if (!data) {
      throw new ApiError("Sub Category not found", "NOT_FOUND");
    }
    return data;
  },
  // Delete a category
  delete: async (title: string) => {
    const data = await model.findOneAndDelete({ title });
    if (!data) {
      throw new ApiError("Sub Category not found", "NOT_FOUND");
    }
    return data;
  },
};
