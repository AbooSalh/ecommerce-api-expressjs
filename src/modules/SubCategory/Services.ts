import subCategory from "./model";
const model = subCategory;
import ApiError from "@/common/utils/api/ApiError";

interface ICreate {
  title: string;
  slug?: string;
  image?: string;
  categoryId: string;
}
interface IUpdate {
  title?: string;
  slug?: string;
  image?: string;
  categoryId?: string;
}
export const subCategoryService = {
  // Get all categories
  getAll: async (filters: Record<string, unknown>, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const results = await model.find(filters).limit(limit).skip(skip);
    const data = {
      subCategories: results,
      currentPage: page,
      hasPrevPage: page > 1,
      hasNextPage: results.length === limit,
      lastPage: Math.ceil((await model.countDocuments()) / limit),
    };
    return data;
  },
  // Get one category
  getOne: async (subCategoryId: string) => {
    const data = await model.findById(subCategoryId);

    if (!data) {
      throw new ApiError("Sub Category not found", "NOT_FOUND");
    }
    return data;
  },
  // Create a new category
  create: async (categoryData: ICreate) => {
    const { title, image, categoryId } = categoryData;
    const data = await model.create({
      title,
      image,
      category: categoryId,
    });
    return data;
  },
  // Update a category
  update: async (subCategoryId: string, updatedData: IUpdate) => {
    const data = await model.findOneAndUpdate(
      { _id: subCategoryId },
      { $set: updatedData },
      { new: true, runValidators: true } // Ensures validation runs on update
    );
    if (!data) {
      throw new ApiError("Sub Category not found", "NOT_FOUND");
    }
    return data;
  },
  // Delete a category
  delete: async (subCategoryId: string) => {
    const data = await model.findByIdAndDelete(subCategoryId);
    if (!data) {
      throw new ApiError("Sub Category not found", "NOT_FOUND");
    }
    return data;
  },
};
