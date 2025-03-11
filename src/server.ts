import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import dbConnection from "./common/config/database.config";
import categoryRouter from "./modules/category/routes";
import ApiError from "./common/utils/api/ApiError";
import globalError from "./common/middleware/globalError";
import subCategoryRoutes from "./modules/SubCategory/routes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // ✅ Middleware for parsing JSON

dbConnection.connect();

app.use("/api", categoryRouter);
app.use("/api", subCategoryRoutes);
// handle all other unhandled routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new ApiError("Route not found", "NOT_FOUND"));
});
app.use(globalError);
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// Events

// handle uncaught exceptions
process.on("unhandledRejection", (err: Error) => {
  console.error(`Internal Server Error: ${err.name} | ${err.message}`);
  console.error("shutting down...");
  server.close(() => process.exit(1));
});

export default app;
