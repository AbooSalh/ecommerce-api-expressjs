import validatorMiddleware from "@/common/middleware/validator";
import { body, oneOf, param } from "express-validator";

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
    param("title").exists().withMessage("Category title is required"),
    oneOf([
      body("title").exists().withMessage("at least update one value"),
      body("image").exists().withMessage("at least update one value"),
    ]),
    // middleware catch
    validatorMiddleware,
  ],
  deleteCategory: [
    // rules
    param("title").exists().withMessage("Category title is required"),
    // middleware catch
    validatorMiddleware,
  ],
  getCategoryByTitle: [
    // rules
    param("title").exists().withMessage("Category title is required"),
    // middleware catch
    validatorMiddleware,
  ],
};
