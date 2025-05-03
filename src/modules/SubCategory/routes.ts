// import express from "express";

import express from "express";
import { subCategoryC as c } from "./controller";
// 
const subCategoryR = express.Router({ mergeParams: true });
// const c = subCategoryController;

subCategoryR
  .route("/")
  .get(c.getAll.validator, c.getAll.handler)
  .post(c.create.validator, c.create.handler);

subCategoryR
  .route("/:id")
  .get(c.getOne.validator, c.getOne.handler)
  .put(c.update.validator, c.update.handler)
  .delete(c.deleteOne.validator, c.deleteOne.handler);
export default subCategoryR;
