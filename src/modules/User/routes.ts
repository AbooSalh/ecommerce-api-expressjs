import express from "express";
import { UserC as c } from "./controller";

const userR = express.Router();
import { imageUploader } from "@/common/middleware/imageHandler";
import authMiddleware from "@/common/middleware/auth";
const { upload, processImages } = imageUploader("user", [
  { name: "image", maxCount: 1 },
]);

userR
  .route("/")
  .get(authMiddleware("admin"), c.getAll.validator, c.getAll.handler)
  .post(
    authMiddleware("admin"),
    upload,
    processImages,
    c.create.validator,
    c.create.handler
  );

userR
  .route("/:id")
  .get(authMiddleware("admin"), c.getOne.validator, c.getOne.handler)
  .put(
    authMiddleware("admin"),
    upload,
    processImages,
    c.update.validator,
    c.update.handler
  )
  .delete(authMiddleware("admin"), c.deleteOne.validator, c.deleteOne.handler);

userR.patch(
  "/:id/change-password",
  authMiddleware("admin", "user"),
  c.changePassword.validator,
  c.changePassword.handler
);

export default userR;
