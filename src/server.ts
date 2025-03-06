import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import dbConnection from "./common/config/database.config";
import categoryRouter from "./modules/category/route";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // ✅ Middleware for parsing JSON

dbConnection();

app.use("/api", [categoryRouter]);
// handle all other unhandled routes
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  next(err);
});
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ success: false, message: err.message });
});
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
