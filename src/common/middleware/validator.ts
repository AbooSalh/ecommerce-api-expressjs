import type { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import ApiError from "../utils/api/ApiError";

export default function validatorMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);
    return next(new ApiError(errorMessages, "BAD_REQUEST"));
  }
  next();
}
