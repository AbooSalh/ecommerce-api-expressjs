/* eslint-disable @typescript-eslint/no-unused-vars */
import type { NextFunction, Request, Response } from "express";
import ApiError from "../utils/api/ApiError";

const globalError = (
  err: ApiError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof ApiError) {
    const { response, errors, stack } = err;
    res.status(response.statusCode).json({
      response,
      errors,
      ...(process.env.NODE_ENV === "development" && { stack }),
    });
  } else {
    res.status(500).json({
      response: {
        statusCode: 500,
        statusMessage: "Internal Server Error",
        status: "error",
        message: err.message,
        timestamp: new Date().toISOString(),
      },
      errors: [{ message: err.message }],
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }
};

export default globalError;
