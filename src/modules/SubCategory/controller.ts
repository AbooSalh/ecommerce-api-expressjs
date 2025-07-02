import baseControllers from "@/common/controllers/handlers";
import SubCategoryM from "./Model";

export const subCategoryC = {
  ...baseControllers(SubCategoryM),
};
