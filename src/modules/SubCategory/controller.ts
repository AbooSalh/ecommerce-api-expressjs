import baseControllers from "@/common/controllers/handlers";
import SubCategoryModel from "./model";

export const subCategoryC = {
  ...baseControllers(SubCategoryModel),
};
