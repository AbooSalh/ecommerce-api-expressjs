import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import dbConnection from "./common/config/database.config";
import categoryRouter from "./modules/category/route";
import ApiError from "./common/utils/ApiError";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // ✅ Middleware for parsing JSON

dbConnection();

app.use("/api", [categoryRouter]);
// handle all other unhandled routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(`Route ${req.originalUrl} not found`, 404));
});
app.use((err: ApiError, req: Request, res: Response, next: NextFunction) => {
  res
    .status(err.statusCode || 500)
    .json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
});
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
