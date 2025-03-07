import type { NextFunction, Request, Response } from "express";
import ApiError from "../utils/ApiError";

const globalError = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  res.status(statusCode).json({
    status,
    message: err.errors.length > 1 ? "Multiple errors occurred" : err.message,
    errors: err.errors.length > 0 ? err.errors : undefined,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default globalError;
