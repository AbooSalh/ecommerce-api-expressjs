import express from "express";
import { productC as c } from "./controller";
import authMiddleware from "@/common/middleware/auth";

const productR = express.Router();
import { imageUploader } from "@/common/middleware/imageHandler";
const { upload, processImages } = imageUploader("products", [
  { name: "images", maxCount: 10 },
  { name: "imageCover", maxCount: 1 },
]);

productR
  .route("/")
  .get(c.getAll.validator, c.getAll.handler)
  .post(
    authMiddleware("admin"),
    upload,
    processImages,
    c.create.validator,
    c.create.handler
  );

productR
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

export default productR;
