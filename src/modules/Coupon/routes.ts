import { Router } from "express";
import { CouponC as c } from "./controller";
import authMiddleware from "@/common/middleware/auth";
const couponR = Router();
couponR.use(authMiddleware("admin"));
couponR.get("/", c.getAll.validator, c.getAll.handler);
couponR.post(
  "/",
  c.create.validator,
  c.create.handler
);
couponR.get("/:id", c.getOne.validator, c.getOne.handler);
couponR.put(
  "/:id",
  c.update.validator,
  c.update.handler
);
couponR.delete(
  "/:id",
  c.deleteOne.validator,
  c.deleteOne.handler
);

export default couponR;
