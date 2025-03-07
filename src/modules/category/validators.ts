import validatorMiddleware from "@/common/middleware/validator";
import { body } from "express-validator";

export const categoryValidator = {
  createCategory: [
    // rules
    body("title").exists().withMessage("Category title is required"),
    body("image").exists().withMessage("Category image is required"),
    // middleware catch
    validatorMiddleware,
  ],
};
