import express from "express";
import { categoryController as controller } from "./controller";
import { categoryValidator as validator } from "./validators";
import subCategoryR from "../SubCategory/routes";
const categoryRouter = express.Router();
categoryRouter
  .route("/")
  .get(controller.getAll)
  .post(validator.createCategory, controller.create);
categoryRouter
  .route("/:categoryId")
  .get(validator.getCategoryByTitle, controller.getOne)
  .put(validator.updateCategory, controller.update)
  .delete(validator.deleteCategory, controller.delete);
categoryRouter.use("/:categoryId/sub-categories", subCategoryR);
export default categoryRouter;
