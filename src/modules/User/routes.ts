import express from "express";
import { UserC as c } from "./controller";

const userR = express.Router();
import { imageUploader } from "@/common/middleware/imageHandler";
const { upload, processImages } = imageUploader("user", [
  { name: "image", maxCount: 1 },
]);
userR
  .route("/")
  .get(c.getAll.validator, c.getAll.handler)
  .post(upload, processImages, c.create.validator, c.create.handler);

userR
  .route("/:id")
  .get(c.getOne.validator, c.getOne.handler)
  .put(upload, processImages, c.update.validator, c.update.handler)
  .delete(c.deleteOne.validator, c.deleteOne.handler);
userR.patch(
  "/:id/change-password",
  c.changePassword.validator,
  c.changePassword.handler
);
export default userR;
