// import express from "express";

import express from "express";
import { subCategoryC as c } from "./controller";
const subCategoryR = express.Router();
// const c = subCategoryController;

subCategoryR
  .route("/sub-category")
  .get(c.getAll.validator, c.getAll.handler)
  .post(c.create.validator, c.create.handler);

subCategoryR
  .route("/sub-category/:title")
  .get(c.getOne.validator, c.getOne.handler)
  .put(c.update.validator, c.update.handler)
  .delete(c.delete.validator, c.delete.handler);
export default subCategoryR