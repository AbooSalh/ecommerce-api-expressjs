import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import ApiError from "../utils/ApiError";

export default function validatorMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);
    return next(
      new ApiError("Validation failed", "BAD_REQUEST", errorMessages)
    );
  }
  next();
}
