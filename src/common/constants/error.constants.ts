import type { Error as MongooseError } from "mongoose";
import { ErrorHandler, ErrorType, MongoServerError } from "../types/error";
import jwt from "jsonwebtoken";

const isValidationError = (
  err: ErrorType
): err is MongooseError.ValidationError => {
  return err.name === "ValidationError";
};

const isMongoServerError = (err: ErrorType): err is MongoServerError => {
  return (
    err.name === "MongoServerError" || (err as MongoServerError).code === 11000
  );
};

const isCastError = (err: ErrorType): err is MongooseError.CastError => {
  return err.name === "CastError";
};

const isJwtError = (err: ErrorType): err is jwt.JsonWebTokenError => {
  return err instanceof jwt.JsonWebTokenError;
};

export const ERROR_MAPPINGS: Record<string, ErrorHandler> = {
  ValidationError: {
    status: "UNPROCESSABLE_ENTITY",
    handle: (err: ErrorType) => {
      if (!isValidationError(err)) throw err;
      return {
        message: Object.values(err.errors)
          .map((error) => error.message)
          .join(", "),
        details: Object.entries(err.errors).map(([field, error]) => ({
          field,
          value: error.value,
          message: error.message,
          code: "VALIDATION_ERROR",
        })),
      };
    },
  },
  MongoServerError: {
    status: "CONFLICT",
    handle: (err: ErrorType) => {
      if (!isMongoServerError(err)) throw err;
      return {
        message: `${Object.keys(err.keyPattern)[0]} '${
          Object.values(err.keyValue)[0]
        }' already exists`,
        details: [
          {
            field: Object.keys(err.keyPattern)[0],
            value: String(Object.values(err.keyValue)[0]),
            message: "Must be unique",
            code: "DUPLICATE_KEY",
          },
        ],
      };
    },
  },
  CastError: {
    status: "BAD_REQUEST",
    handle: (err: ErrorType) => {
      if (!isCastError(err)) throw err;
      return {
        message: `Invalid ${err.path}: ${err.value}`,
        details: [
          {
            field: err.path,
            value: String(err.value),
            message: "Invalid value type",
            code: "INVALID_TYPE",
          },
        ],
      };
    },
  },
  JsonWebTokenError: {
    status: "UNAUTHORIZED",
    handle: (err: ErrorType) => {
      if (!isJwtError(err)) throw err;
      if (err instanceof jwt.TokenExpiredError) {
        return {
          message: "Token expired",
          details: [
            { message: "Your session has expired. Please login again." },
          ],
        };
      }
      if (err instanceof jwt.NotBeforeError) {
        return {
          message: "Token not active",
          details: [{ message: "Token is not yet active." }],
        };
      }
      return {
        message: "Invalid token",
        details: [{ message: "Invalid authentication token." }],
      };
    },
  },
};
