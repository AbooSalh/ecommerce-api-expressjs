import express from "express";
import { brandC as c } from "./controller";
import authMiddleware from "@/common/middleware/auth";

const brandR = express.Router();
import { imageUploader } from "@/common/middleware/imageHandler";
const { upload, processImages } = imageUploader("users", [
  { name: "image", maxCount: 1 },
]);

brandR
  .route("/")
  .get(c.getAll.handler)
  .post(
    authMiddleware("admin"),
    upload,
    processImages,
    c.create.validator,
    c.create.handler
  );
brandR
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
export default brandR;
