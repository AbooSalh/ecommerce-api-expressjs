export interface ApiResponseI {
  statusCode: number;
  statusMessage: string;
  status: "success" | "fail" | "error";
  message: string;
  timestamp: string;
}

export default class ApiResponse implements ApiResponseI {
  public statusCode: number;
  public statusMessage: string;
  public status: "success" | "fail" | "error";
  public message: string;
  public timestamp: string;

  constructor(statusCode: number, statusMessage: string, message: string) {
    this.statusCode = statusCode;
    this.statusMessage = statusMessage;
    this.message = message;
    this.timestamp = new Date().toISOString();
    this.status = this.determineStatus(statusCode);
  }

  private determineStatus(statusCode: number): "success" | "fail" | "error" {
    if (statusCode >= 200 && statusCode < 300) {
      return "success";
    } else if (statusCode >= 400 && statusCode < 500) {
      return "fail";
    } else {
      return "error";
    }
  }
}
