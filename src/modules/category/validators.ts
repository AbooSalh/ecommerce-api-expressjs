import validatorMiddleware from "@/common/middleware/validator";
import { body, oneOf } from "express-validator";

export const categoryValidator = {
  createCategory: [
    // rules
    body("title").exists().withMessage("Category title is required"),
    body("image").exists().withMessage("Category image is required"),
    // middleware catch
    validatorMiddleware,
  ],
  updateCategory: [
    // rules
    // at least one exists
    oneOf([
      body("title").exists().withMessage("Category title is required"),
      body("image").exists().withMessage("Category image is required"),
    ]),
    // middleware catch
    validatorMiddleware,
  ],
  deleteCategory: [
    // rules
    body("title").exists().withMessage("Category title is required"),
    // middleware catch
    validatorMiddleware,
  ],
  getCategoryByTitle: [
    // rules
    body("title").exists().withMessage("Category title is required"),
    // middleware catch
    validatorMiddleware,
  ],
};
