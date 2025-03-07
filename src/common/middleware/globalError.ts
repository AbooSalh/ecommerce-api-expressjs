import { NextFunction, Response, Request } from "express";
import ApiError from "../utils/ApiError";

const globalError = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(err.statusCode || 500).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
export default globalError;