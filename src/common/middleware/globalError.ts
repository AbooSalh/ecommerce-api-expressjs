import { NextFunction, Response, Request } from "express";
import ApiError from "../utils/ApiError";

const globalError = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Fallback for unexpected errors
  const statusCode = err.statusCode || 500;
  const status = err.status || "error";

  res.status(statusCode).json({
    status,
    message: err.message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};

export default globalError;
