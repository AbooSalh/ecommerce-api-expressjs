import { Response } from "express";
import { HTTP_STATUS } from "@/common/constants/httpStatus"; // Import status constants
import ApiResponse from "@/common/utils/api/ApiResponse";

class ApiSuccess {
  public response: ApiResponse;
  public results: object | null;

  constructor(
    status: keyof (typeof HTTP_STATUS)["SUCCESS"],
    message: string,
    results: object | null = null
  ) {
    this.response = new ApiResponse(HTTP_STATUS.SUCCESS[status], "OK", message);
    this.results = results;
  }

  /** Sends response directly using Express `res` */
  private send(res: Response): void {
    res.status(this.response.statusCode).json(this);
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
