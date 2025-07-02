import mongoose from "mongoose";
import SubCategory from "../SubCategory/Model";
import BrandM from "../Brands/model";
import { CustomValidator } from "express-validator";
import Category from "../category/model";

// Helper function to validate ObjectId
const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

// Helper function to throw an error with a custom message
const throwValidationError = (message: string): never => {
  throw new Error(message);
};

// Validator to check if a category exists
export const checkIfCategoryExists: CustomValidator = async (
  categoryId: string
) => {
  if (!isValidObjectId(categoryId)) {
    throwValidationError("Invalid category ID format");
  }

  const category = await Category.findById(categoryId);
  if (!category) {
    throwValidationError("Category not found");
  }

  return true;
};

// Validator to check if subcategories exist and belong to the specified category
export const checkIfSubCategoriesExist: CustomValidator = async (
  subCategoryIds: string[],
  { req }
) => {
  if (!Array.isArray(subCategoryIds)) {
    throwValidationError("Sub categories must be an array");
  }

  const categoryId = req.body.category;
  if (!categoryId) {
    throwValidationError("Category ID is required to validate subcategories");
  }

  // Validate all subcategory IDs
  const invalidIds = subCategoryIds.filter((id) => !isValidObjectId(id));
  if (invalidIds.length > 0) {
    throwValidationError(
      `Invalid subcategory ID format: ${invalidIds.join(", ")}`
    );
  }

  // Find subcategories and ensure they belong to the specified category
  const subCategories = await SubCategory.find({
    _id: { $in: subCategoryIds },
    category: categoryId,
  });

  if (subCategories.length !== subCategoryIds.length) {
    throwValidationError(
      `Some subcategories either don't exist or don't belong to the specified category`
    );
  }

  return true;
};

// Validator to check if a brand exists
export const checkIfBrandExists: CustomValidator = async (brandId: string) => {
  if (!isValidObjectId(brandId)) {
    throwValidationError("Invalid brand ID format");
  }

  const brand = await BrandM.findById(brandId);
  if (!brand) {
    throwValidationError("Brand not found");
  }

  return true;
};
