import express from "express";
import { productC as c } from "./controller";

const productR = express.Router();

productR
  .route("/")
  .get(c.getAll.validator, c.getAll.handler)
  .post(c.create.validator, c.create.handler);

productR
  .route("/:id")
  .get(c.getOne.validator, c.getOne.handler)
  .put(c.update.validator, c.update.handler)
  .delete(c.deleteOne.validator, c.deleteOne.handler);

export default productR;
