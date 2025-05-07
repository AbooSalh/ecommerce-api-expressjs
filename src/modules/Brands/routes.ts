import express from "express";
import { brandC as c } from "./controller";
const brandR = express.Router();
import { imageUploader } from "@/common/middleware/imageHandler";
const { upload, processImages } = imageUploader("users", [
  { name: "image", maxCount: 1 },
]);

brandR
  .route("/")
  .get(c.getAll.handler)
  .post(upload, processImages, c.create.validator, c.create.handler);
brandR
  .route("/:id")
  .get(c.getOne.validator, c.getOne.handler)
  .put(upload, processImages, c.update.validator, c.update.handler)
  .delete(c.deleteOne.validator, c.deleteOne.handler);
export default brandR;
