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
    message: string,
    statusCode: number | keyof typeof ApiError.statusCodes = 500,
    errors: string[] = []
  ) {
    super(message);

    this.statusCode =
      typeof statusCode === "string"
        ? ApiError.statusCodes[statusCode]
        : statusCode;

    this.status =
      this.statusCode >= 400 && this.statusCode < 500 ? "fail" : "error";

    this.isOperational = true;
    this.errors = errors;

    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export default ApiError;
