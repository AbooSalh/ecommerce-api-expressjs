import { HTTP_STATUS } from "@/common/constants/httpStatus";
import ApiResponse, { ApiResponseI } from "./ApiResponse";
import { Response } from "express";

interface ApiErrorDetail {
  message: string;
  field?: string;
}

class ApiError extends Error {
  public response: ApiResponseI;
  public errors: ApiErrorDetail[];

  constructor(
    errors: ApiErrorDetail[] | string = [],
    status: keyof (typeof HTTP_STATUS)["ERROR"] = "INTERNAL_SERVER_ERROR"
  ) {
    super(typeof errors === "string" ? errors : errors[0].message); // Set first error message as main message

    const statusCode = HTTP_STATUS.ERROR[status];
    const statusMessage = status.replace(/_/g, " "); // Convert ENUM-style to readable format
    const message = typeof errors === "string" ? errors : errors[0].message;

    this.response = new ApiResponse(statusCode, statusMessage, message);

    this.errors = Array.isArray(errors) ? errors : [{ message: errors }];

    Object.setPrototypeOf(this, new.target.prototype); // Ensures `instanceof` works
  }

  /** Sends response directly using Express `res` */
  public send(res: Response): void {
    res.status(this.response.statusCode).json({
      response: this.response,
      data: this.errors,
      ...(process.env.NODE_ENV === "development" && { stack: this.stack }),
    });
  }
}

export default ApiError;
