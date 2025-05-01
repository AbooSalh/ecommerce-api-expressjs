
import ProductM from "./model";
import ApiError from "@/common/utils/api/ApiError";
import { ApiFeatures } from "@/common/utils/api/ApiFeatures";

export const productService = {
  // Get all products
  getAll: async (reqQuery: { [key: string]: string }) => {
    const apiFeatures = new ApiFeatures(ProductM.find(), reqQuery)
      .filter()
      .search()
      .sort()
      .paginate(await ProductM.countDocuments())
      .limitFields();
    const { mongooseQuery, pagination } = await apiFeatures;
    const data = await mongooseQuery;

    return { data, pagination };
  },

  // Get one product by slug
  getOne: async (id: string) => {
    const product = await ProductM.findById(id)
      .populate("category")
      .populate("subCategories")
      .populate("brand");
    if (!product) {
      throw new ApiError("Product not found", "NOT_FOUND");
    }
    return product;
  },

  


};
