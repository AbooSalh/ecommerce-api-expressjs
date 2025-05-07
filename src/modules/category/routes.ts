import express from "express";
import { categoryC as c } from "./controller";
import subCategoryR from "../SubCategory/routes";
const categoryRouter = express.Router();
import { imageHandler } from "@/common/middleware/imageHandler";
const { uploadImage, processImage } = imageHandler("category", "image");
categoryRouter
  .route("/")
  .get(c.getAll.handler)
  .post(uploadImage, processImage, c.create.validator, c.create.handler);
categoryRouter
  .route("/:id")
  .get(c.getOne.validator, c.getOne.handler)
  .put(c.update.validator, c.update.handler)
  .delete(
    uploadImage,
    processImage,
    c.deleteOne.validator,
    c.deleteOne.handler
  );
categoryRouter.use("/:id/sub-categories", subCategoryR);
export default categoryRouter;
