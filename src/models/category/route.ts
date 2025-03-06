import express from "express";
import { createCategory, getCategories } from "./controller";
const categoryRouter = express.Router();
categoryRouter.route("/categories").get(getCategories).post(createCategory);
export default categoryRouter;
