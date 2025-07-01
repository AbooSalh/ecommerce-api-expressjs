// Exported function to create a rate limiter middleware

import rateLimit from "express-rate-limit";

/**
 * Create a rate limiter middleware.
 * @param minutes - Time window in minutes
 * @param max - Max requests per window per IP
 */
export default function createRateLimiter({
  minutes,
  max,
}: {
  minutes: number;
  max: number;
}) {
  return rateLimit({
    windowMs: minutes * 60 * 1000,
    max,
    message: "Too many requests, please try again later.",
  });
}
