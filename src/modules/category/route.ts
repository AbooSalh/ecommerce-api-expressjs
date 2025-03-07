import express from "express";
import { categoryController as controller } from "./controller";
import {categoryValidator as validator} from "./validators";
const categoryRouter = express.Router();
categoryRouter
  .route("/categories")
  .get(controller.getAll)
  .post(validator.createCategory, controller.create);

categoryRouter
  .route("/categories/:title")
  .get(controller.getOne)
  .put(controller.update)
  .delete(controller.delete);
export default categoryRouter;
