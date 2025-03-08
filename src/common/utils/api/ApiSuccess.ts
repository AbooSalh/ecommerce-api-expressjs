import { Response } from "express";

class ApiSuccess {
  public statusCode: number;
  public status: string;
  public message: string;
  public data: object | null;
  public timestamp: string;

  private static statusCodes = {
    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
  } as const;

  constructor(
    statusCode: number | keyof typeof ApiSuccess.statusCodes = 200,
    message: string,
    data: object | null = null
  ) {
    this.statusCode =
      typeof statusCode === "string"
        ? ApiSuccess.statusCodes[statusCode]
        : statusCode;

    this.status =
      this.statusCode >= 200 && this.statusCode < 300 ? "success" : "info";
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  /**  Sends response directly using Express `res` */
  send(res: Response): void {
    res.status(this.statusCode).json(this);
  }

  /**  Static method for convenience */
  static send(
    res: Response,
    statusCode: number | keyof typeof ApiSuccess.statusCodes,
    message: string,
    data: object | null = null
  ) {
    new ApiSuccess(statusCode, message, data).send(res);
  }
}

export default ApiSuccess;
