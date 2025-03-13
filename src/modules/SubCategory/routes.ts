// import express from "express";

import app from "@/server";
import express from "express";
import { subCategoryC as c } from "./controller";
const subCategoryRoutes = express.Router();
// const c = subCategoryController;

subCategoryRoutes
  .route("/sub-categories")
  .get(c.getAll.validator, c.getAll.handler);
//   .post(c.create.validator, c.create.handler);

// subCategoryRoutes.route("/sub-categories/:id");
// //   .get(c.getOne.validator, c.getOne.handler)
// //   .put(c.update.validator, c.update.handler)
// //   .delete(c.delete.validator, c.delete.handler);
app.use("/api", subCategoryRoutes);
