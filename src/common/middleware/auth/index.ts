import ApiError from "@/common/utils/api/ApiError";
import UserModel from "@/modules/User/model";
import { RequestHandler } from "express";
import expressAsyncHandler from "express-async-handler";
import jwt, { JwtPayload } from "jsonwebtoken";

const authMiddleware: RequestHandler = expressAsyncHandler(
  async (req, res, next) => {
    if (req.headers.authorization?.startsWith("Bearer")) {
      const token = req.headers.authorization.split(" ")[1];
      //   check if token is provided
      if (!token) {
        return next(
          new ApiError("No token provided - please login", "UNAUTHORIZED")
        );
      }
      //   verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as JwtPayload & { id: string , iat: number};
      //   check if user exists
      const currentUser = await UserModel.findById(decoded.id);
      if (!currentUser) {
        return next(new ApiError("User not found ", "UNAUTHORIZED"));
      }
      //   check if user has changed password after token was issued
      if (currentUser.passwordChangedAt) {
        const passwordChangedAt = new Date(currentUser.passwordChangedAt);
        const tokenIssuedAt = new Date(decoded.iat * 1000);
        if (passwordChangedAt.getTime() > tokenIssuedAt.getTime()) {
          return next(
            new ApiError("Password changed - please login", "UNAUTHORIZED")
          );
        }
      }
    } else {
      return next(
        new ApiError("No token provided - please login", "UNAUTHORIZED")
      );
    }
    next();
  }
);

export default authMiddleware;
