export interface MetaData {
  total: number;
  limit: number;
  offset: number;
  page: number;
  pages: number;
}

export interface ApiErrorDetail {
  message: string;
  field?: string; // Optional if the error isn't field-specific
}

export interface ApiResponse<T> {
  response: {
    statusCode: number;
    statusMessage: string;
    status: "success" | "fail" | "error";
    message: string;
  };
  data?: T | T[]; // Can be a single object or an array
  meta?: MetaData; // Optional pagination metadata
  errors?: ApiErrorDetail[]; // Moved errors to the top level for better flexibility
}

