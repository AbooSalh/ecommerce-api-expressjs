import { ICreateProduct } from "./interfaces";
import ProductM from "./model";
import ApiError from "@/common/utils/api/ApiError";

export const productService = {
  // Get all products
  getAll: async (filters: Record<string, unknown>, page = 1, limit = 10) => {
    const skip = (page - 1) * limit;
    const results = await ProductM.find(filters)
      .populate("category")
      .populate("subCategories")
      .populate("brand")
      .limit(limit)
      .skip(skip);
    const data = {
      products: results,
      currentPage: page,
      hasPrevPage: page > 1,
      hasNextPage: results.length === limit,
      lastPage: Math.ceil((await ProductM.countDocuments(filters)) / limit),
    };
    return data;
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
    const product = await ProductM.create(productData);
    return product;
  },

  // Update a product by slug
  update: async (id: string, updatedData: Partial<ICreateProduct>) => {
    const product = await ProductM.findByIdAndUpdate(
      id,
      { $set: updatedData },
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
