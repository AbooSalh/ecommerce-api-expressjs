import express from "express";
import { categoryController } from "./controller";
const categoryRouter = express.Router();
categoryRouter
  .route("/categories")
  .get(categoryController.getAll)
  .post(categoryController.create);
categoryRouter
  .route("/categories/:title")
  .get(categoryController.getOne)
  .put(categoryController.update);
export default categoryRouter;
