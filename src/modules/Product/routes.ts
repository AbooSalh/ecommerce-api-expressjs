import express from "express";
import { productC as c } from "./controller";

const productR = express.Router();
import { imageUploader } from "@/common/middleware/imageHandler";
const { upload, processImages } = imageUploader("products", [
  { name: "images", maxCount: 10 },
  { name: "imageCover", maxCount: 1 },
]);
productR
  .route("/")
  .get(c.getAll.validator, c.getAll.handler)
  .post(upload, processImages, c.create.validator, c.create.handler);

productR
  .route("/:id")
  .get(c.getOne.validator, c.getOne.handler)
  .put(upload, processImages, c.update.validator, c.update.handler)
  .delete(c.deleteOne.validator, c.deleteOne.handler);

export default productR;
