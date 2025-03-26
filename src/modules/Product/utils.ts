import Category from "../Category/model";
import SubCategory from "../SubCategory/model";
import { CustomValidator } from "express-validator";
import BrandM from "../Brands/model";
import mongoose from "mongoose";

export const checkIfCategoryExists: CustomValidator = async (categoryId: string) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      throw new Error("Invalid category ID format");
    }
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new Error("Category not found");
    }
    return true;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Invalid category");
  }
};

export const checkIfSubCategoriesExist: CustomValidator = async (subCategoryIds: string[]) => {
  try {
    if (!Array.isArray(subCategoryIds)) {
      throw new Error("Sub categories must be an array");
    }

    // Validate all IDs first
    const invalidIds = subCategoryIds.filter(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalidIds.length > 0) {
      throw new Error(`Invalid subcategory ID format: ${invalidIds.join(', ')}`);
    }

    const subCategories = await SubCategory.find({
      _id: { $in: subCategoryIds },
    });

    if (subCategories.length !== subCategoryIds.length) {
      const foundIds = subCategories.map(sub => sub._id.toString());
      const notFound = subCategoryIds.filter(id => !foundIds.includes(id));
      throw new Error(`Sub categories not found: ${notFound.join(', ')}`);
    }

    return true;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Invalid subcategories");
  }
};

export const checkIfBrandExists: CustomValidator = async (brandId: string) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(brandId)) {
      throw new Error("Invalid brand ID format");
    }
    const brand = await BrandM.findById(brandId);
    if (!brand) {
      throw new Error("Brand not found");
    }
    return true;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Invalid brand");
  }
};