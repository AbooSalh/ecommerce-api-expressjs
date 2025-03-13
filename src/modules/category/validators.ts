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
    param("categorySlug").exists().withMessage("Category title is required"),
    body("title")
      .isLength({ min: 3, max: 32 })
      .withMessage("Category title is too short at least 3 characters"),
    oneOf([
      body("title").exists().withMessage("at least update one value"),
      body("image").exists().withMessage("at least update one value"),
    ]),
    // middleware catch
    validatorMiddleware,
  ],
  deleteCategory: [
    // rules
    param("categorySlug").exists().withMessage("Category title is required"),
    // middleware catch
    validatorMiddleware,
  ],
  getCategoryByTitle: [
    // rules
    param("categorySlug").exists().withMessage("Category title is required"),
    // middleware catch
    validatorMiddleware,
  ],
};
