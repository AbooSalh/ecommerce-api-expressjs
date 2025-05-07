import express from "express";
import { categoryC as c } from "./controller";
import subCategoryR from "../SubCategory/routes";
const categoryRouter = express.Router();
import { imageUploader } from "@/common/middleware/imageHandler";
const { upload, processImages } = imageUploader("users", [
  { name: "image", maxCount: 1 },
]);
categoryRouter
  .route("/")
  .get(c.getAll.handler)
  .post(upload, processImages, c.create.validator, c.create.handler);
categoryRouter
  .route("/:id")
  .get(c.getOne.validator, c.getOne.handler)
  .put(c.update.validator, c.update.handler)
  .delete(upload, processImages, c.deleteOne.validator, c.deleteOne.handler);
categoryRouter.use("/:id/sub-categories", subCategoryR);
export default categoryRouter;
