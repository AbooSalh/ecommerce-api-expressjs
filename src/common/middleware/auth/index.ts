import ApiError from "@/common/utils/api/ApiError";
import { RequestHandler } from "express";
import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";

const authMiddleware: RequestHandler = expressAsyncHandler(
  async (req, res, next) => {
    if (req.headers.authorization?.startsWith("Bearer")) {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return next(
          new ApiError("No token provided - please login", "UNAUTHORIZED")
        );
      }
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      console.log(decoded);
    } else {
      return next(
        new ApiError("No token provided - please login", "UNAUTHORIZED")
      );
    }
    next();
  }
);

export default authMiddleware;
