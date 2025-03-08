import { HTTP_STATUS } from "@/common/constants/httpStatus";

class ApiError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;
  public errors: string[];

  constructor(
    errors: string[] | string = [],
    status: keyof (typeof HTTP_STATUS)["ERROR"] = "INTERNAL_SERVER_ERROR"
  ) {
    super(typeof errors === "string" ? errors : errors[0]); // Set first error as main message

    this.statusCode = HTTP_STATUS.ERROR[status]; // Convert string to number
    this.status = "fail";
    this.isOperational = true;
    this.errors = Array.isArray(errors) ? errors : [errors];

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default ApiError;
