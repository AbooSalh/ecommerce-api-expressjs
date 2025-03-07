import express , { Request, Response, NextFunction } from "express";
import { categoryController } from "./controller";
import { param, validationResult } from "express-validator";
const categoryRouter = express.Router();
categoryRouter
  .route("/categories")
  .get(categoryController.getAll)
  .post(categoryController.create);
categoryRouter
  .route("/categories/:title")
  .get(categoryController.getOne)
  .put(categoryController.update)
  .delete(
    // rules
    param("title").exists().withMessage("Category title is required"),
    // middleware catch
    (req: Request, res: Response, next: NextFunction) => {
      // finds the validation errors in this request and wraps them in an object
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
      } else {
        next();
      }
    },
    categoryController.delete
  );
export default categoryRouter;
