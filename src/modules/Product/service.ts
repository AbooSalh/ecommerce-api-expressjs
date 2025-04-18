import { filterExcludedKeys } from "@/common/utils/filterExcludedKeys";
import { ICreateProduct } from "./interfaces";
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

  // Create a new product
  create: async (productData: ICreateProduct) => {
    // Filter the data to only include the fields we want to save
    const filteredData = filterExcludedKeys(productData, ["ratings", "sold"]);
    const product = await ProductM.create(filteredData);
    return product;
  },

  // Update a product by slug
  update: async (id: string, updatedData: Partial<ICreateProduct>) => {
    const filteredData = filterExcludedKeys(updatedData, ["ratings", "sold"]);

    const product = await ProductM.findByIdAndUpdate(
      id,
      { $set: filteredData },
      { new: true, runValidators: true }
    );
    if (!product) {
      throw new ApiError("Product not found", "NOT_FOUND");
    }
    return product;
  },

  // Delete a product by slug
  delete: async (id: string) => {
    const product = await ProductM.findByIdAndDelete(id);
    if (!product) {
      throw new ApiError("Product not found", "NOT_FOUND");
    }
    return product;
  },
};
