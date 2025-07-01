import express, { NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import dbConnection from "./common/config/database.config";
import globalError from "./common/middleware/globalError";
import ApiError from "./common/utils/api/ApiError";
import { mountRoutes } from "./index";
import dotenvExpand from "dotenv-expand";
import cors from "cors";
import compression from "compression";
import { webHookCheckout } from "./modules/Order/service";

import createRateLimiter from "./common/utils/api/rateLimiter";
import hpp from "hpp";

import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";

dotenvExpand.expand(dotenv.config());
const app = express();
const PORT = process.env.PORT || 5000;
// Global rate limiter: 1000 requests per 15 minutes per IP (for all routes)
app.use(createRateLimiter({ minutes: 15, max: 1000 }));
// Prevent NoSQL injection
app.use(mongoSanitize());
// Prevent XSS attacks
app.use(xss());
// Prevent HTTP Parameter Pollution
app.use(hpp());
app.use(express.urlencoded({ extended: true }));
app.post(
  "/api/stripe/webhook-checkout",
  express.raw({ type: "application/json" }),
  webHookCheckout
); // ✅ Middleware for parsing raw body for Stripe webhook
app.use(express.json());
app.use(express.static("public"));
app.use(compression());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
    credentials: true,
  })
);

// ✅ Middleware for serving static files
dbConnection.connect();
mountRoutes(app);
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
