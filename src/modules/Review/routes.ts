import { Router } from "express";
import { reviewController as c } from "./controller";
import authMiddleware from "@/common/middleware/auth";
import reviewValidator from "./validators";
const reviewR = Router();

reviewR.get("/", c.getAll.validator, c.getAll.handler);
reviewR.post(
  "/",
  authMiddleware("user"),
  reviewValidator.create,
  c.create.validator,
  c.create.handler
);
reviewR.get("/:id", c.getOne.validator, c.getOne.handler);
reviewR.put(
  "/:id",
  authMiddleware("user"),
  reviewValidator.update,
  c.update.validator,
  c.update.handler
);
reviewR.delete(
  "/:id",
  authMiddleware("admin", "user"),
  reviewValidator.delete,
  c.deleteOne.validator,
  c.deleteOne.handler
);

export default reviewR;
