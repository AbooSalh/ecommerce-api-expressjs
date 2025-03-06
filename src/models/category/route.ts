import express from "express";
import { categoryController } from "./controller";
const categoryRouter = express.Router();
categoryRouter
  .route("/categories")
  .get(categoryController.getAll)
  .post(categoryController.createCategory);
export default categoryRouter;
