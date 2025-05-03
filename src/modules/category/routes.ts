import express from "express";
import { categoryC as c } from "./controller";
import subCategoryR from "../SubCategory/routes";
const categoryRouter = express.Router();
categoryRouter
  .route("/")
  .get(c.getAll.handler)
  .post(c.create.validator, c.create.handler);
categoryRouter
  .route("/:id")
  .get(c.getOne.validator, c.getOne.handler)
  .put(c.update.validator, c.update.handler)
  .delete(c.deleteOne.validator, c.deleteOne.handler);
categoryRouter.use("/:id/sub-categories", subCategoryR);
export default categoryRouter;
