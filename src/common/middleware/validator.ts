import type { Request, Response, NextFunction } from "express";
import { validationResult, ValidationError } from "express-validator";
import ApiError from "../utils/api/ApiError";

interface ApiErrorDetail {
  message: string;
  field?: string;
}

export default function validatorMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages: ApiErrorDetail[] = errors
      .array()
      .map((err: ValidationError) => ({
        message: err.msg,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        field: (err as any).param, // Cast to any to access param property
      }));
    return next(new ApiError(errorMessages, "BAD_REQUEST"));
  }
  next();
}
