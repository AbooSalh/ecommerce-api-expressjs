// @desc this class is used to handle errors about operational errors that can be predicted
class ApiError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    // Maintain correct prototype chain
  }
}

export default ApiError;
