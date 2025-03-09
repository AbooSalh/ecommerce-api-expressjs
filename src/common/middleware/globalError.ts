import type { NextFunction, Request, Response } from "express";
import ApiError from "../utils/api/ApiError";

const globalError = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { response, errors, stack } = err;

  res.status(response.statusCode).json({
    response,
    errors,
    ...(process.env.NODE_ENV === "development" && { stack }),
  });
  next();
};

export default globalError;
