/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NextFunction, Request, Response } from "express";
import { Error as MongooseError } from "mongoose";
import ApiError from "../utils/api/ApiError";

class ErrorHandler {
  private static handleMongooseValidationError(
    err: MongooseError.ValidationError
  ): ApiError {
    const message = Object.values(err.errors)
      .map((error) => error.message)
      .join(", ");
    return new ApiError(message, "UNPROCESSABLE_ENTITY");
  }

  private static handleMongooseCastError(
    err: MongooseError.CastError
  ): ApiError {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new ApiError(message, "UNPROCESSABLE_ENTITY");
  }

  public static handleError(err: any): ApiError {
    if (err instanceof ApiError) {
      return err;
    }

    if (err instanceof MongooseError.ValidationError) {
      return this.handleMongooseValidationError(err);
    }

    if (err instanceof MongooseError.CastError) {
      return this.handleMongooseCastError(err);
    }

    return new ApiError(err.message, "INTERNAL_SERVER_ERROR");
  }
}

const globalError = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = ErrorHandler.handleError(err);
  error.send(res);
  next();
};

export default globalError;
