import { ApiFeatures } from "@/common/utils/api/ApiFeatures";
import BrandM from "./model";
import ApiError from "@/common/utils/api/ApiError";
const model = BrandM;
interface ICreateBrand {
  title: string;
  slug?: string;
  image?: string;
}

export const brandS = {
  // Get all categories
  getAll: async (reqQuery: { [key: string]: string }) => {
    const apiFeatures = new ApiFeatures(model.find(), reqQuery)
      .filter()
      .search()
      .sort()
      .paginate(await model.countDocuments())
      .limitFields();
    const { mongooseQuery, pagination } = await apiFeatures;
    const data = await mongooseQuery;
    return { data, pagination };
  },
  // Get one category
  getOne: async (slug: string) => {
    const data = await model.findOne({ slug });
    if (!data) {
      throw new ApiError("brand not found", "NOT_FOUND");
    }
    return data;
  },
  // Create a new category
  create: async (brandData: ICreateBrand) => {
    const { title, image } = brandData;
    const data = await model.create({
      title,
      image,
    });
    return data;
  },
  // Update a category
  update: async (slug: string, updatedData: ICreateBrand) => {
    const data = await model.findOneAndUpdate(
      { slug },
      { $set: updatedData },
      { new: true, runValidators: true } // Ensures validation runs on update
    );
    if (!data) {
      throw new ApiError("brand not found", "NOT_FOUND");
    }
    return data;
  },
  // Delete a category
  delete: async (slug: string) => {
    const data = await model.findOneAndDelete({ slug });
    if (!data) {
      throw new ApiError("brand not found", "NOT_FOUND");
    }
    return data;
  },
};
