import express from "express";
import { brandC as c } from "./controller";
const brandR = express.Router();
import { imageHandler } from "@/common/middleware/imageHandler";
const { uploadImage, processImage } = imageHandler("brands", "image");
brandR
  .route("/")
  .get(c.getAll.handler)
  .post(uploadImage, processImage, c.create.validator, c.create.handler);
brandR
  .route("/:id")
  .get(c.getOne.validator, c.getOne.handler)
  .put(uploadImage, processImage, c.update.validator, c.update.handler)
  .delete(c.deleteOne.validator, c.deleteOne.handler);
export default brandR;
