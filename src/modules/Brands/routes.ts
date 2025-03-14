import express from "express";
import { brandC as c } from "./controller";
const brandR = express.Router();
brandR
  .route("/")
  .get(c.getAll.handler)
  .post(c.create.validator, c.create.handler);
brandR
  .route("/:brandSlug")
  .get(c.getOne.validator, c.getOne.handler)
  .put(c.update.validator, c.update.handler)
  .delete(c.delete.validator, c.delete.handler);
export default brandR;
