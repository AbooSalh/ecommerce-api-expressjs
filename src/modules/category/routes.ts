import express from "express";
import { categoryController as controller } from "./controller";
import { categoryValidator as validator } from "./validators";
const categoryRouter = express.Router();
categoryRouter
  .route("/categories")
  .get(controller.getAll)
  .post(validator.createCategory, controller.create);

categoryRouter
  .route("/categories/:title")
  .get(validator.getCategoryByTitle, controller.getOne)
  .put(validator.updateCategory, controller.update)
  .delete(validator.deleteCategory, controller.delete);
export default categoryRouter;
