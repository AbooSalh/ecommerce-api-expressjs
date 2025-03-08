import { Response } from "express";
import { HTTP_STATUS } from "@/common/constants/httpStatus"; // Import status constants

class ApiSuccess {
  public statusCode: number;
  public status: string;
  public message: string;
  public data: object | null;
  public timestamp: string;

  constructor(
    status: keyof (typeof HTTP_STATUS)["SUCCESS"],
    message: string,
    data: object | null = null
  ) {
    this.statusCode = HTTP_STATUS.SUCCESS[status]; // Convert string to number
    this.status = "success";
    this.message = message;
    this.data = data;
    this.timestamp = new Date().toISOString();
  }

  /** Sends response directly using Express `res` */
  private send(res: Response): void {
    res.status(this.statusCode).json(this);
  }

  /** Static method for convenience */
  static send(
    res: Response,
    status: keyof (typeof HTTP_STATUS)["SUCCESS"],
    message: string,
    data: object | null = null
  ) {
    new ApiSuccess(status, message, data).send(res);
  }
}

export default ApiSuccess;
