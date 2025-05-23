// import express from "express";

import express from "express";
import { subCategoryC as c } from "./controller";
//
import authMiddleware from "@/common/middleware/auth";

const subCategoryR = express.Router({ mergeParams: true });
// const c = subCategoryController;
import { imageUploader } from "@/common/middleware/imageHandler";
const { upload, processImages } = imageUploader("users", [
  { name: "image", maxCount: 1 },
]);
subCategoryR
  .route("/")
  .get(c.getAll.validator, c.getAll.handler)
  .post(
    authMiddleware("admin"),
    upload,
    processImages,
    c.create.validator,
    c.create.handler
  );

subCategoryR
  .route("/:id")
  .get(c.getOne.validator, c.getOne.handler)
  .put(
    authMiddleware("admin"),
    upload,
    processImages,
    c.update.validator,
    c.update.handler
  )
  .delete(authMiddleware("admin"), c.deleteOne.validator, c.deleteOne.handler);
export default subCategoryR;
