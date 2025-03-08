class ApiError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;
  public errors: string[];

  private static statusCodes = {
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
  } as const;

  constructor(
    errors: string[] | string = [], // Default to an empty array
    statusCode: number | keyof typeof ApiError.statusCodes = 500
  ) {
    super(typeof errors === "string" ? errors : errors[0]); // Set first error as main message

    this.statusCode =
      typeof statusCode === "string"
        ? ApiError.statusCodes[statusCode]
        : statusCode;

    this.status =
      this.statusCode >= 400 && this.statusCode < 500 ? "fail" : "error";

    this.isOperational = true;
    this.errors = Array.isArray(errors) ? errors : [errors]; // Ensure it's always an array

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default ApiError;
