import { Request, Response, NextFunction } from "express";
import UserModel from "./model";
import ApiError from "@/common/utils/api/ApiError";
import bcrypt from "bcryptjs";
import ApiSuccess from "@/common/utils/api/ApiSuccess";
import OrderM from "../Order/model";
import { ApiFeatures, IRequestBody } from "@/common/utils/api/ApiFeatures";

export const changePassword = async (req: Request, res: Response) => {
  const id = req.user?._id;
  if (!id) {
    throw new ApiError("User not found", "UNAUTHORIZED");
  }
  const { newPassword } = req.body;
  const result = await UserModel.findByIdAndUpdate(
    id,
    {
      $set: {
        password: await bcrypt.hash(newPassword, 10),
        passwordChangedAt: Date.now(),
      },
    },
    { new: true, runValidators: true }
  ).select("-password");

  if (!result) {
    throw new ApiError("Not found", "NOT_FOUND");
  }
  return ApiSuccess.send(res, "OK", "Password updated successfully", result);
};

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?._id) {
    throw new ApiError("User not found", "UNAUTHORIZED");
  }
  req.params.id = req.user._id.toString();
  next();
};

export const updateAuthUser = async (req: Request, res: Response) => {
  const updatedUser = await UserModel.findByIdAndUpdate(
    req.user?._id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    { new: true }
  );

  if (!updatedUser) {
    throw new ApiError("User not found", "NOT_FOUND");
  }
  return ApiSuccess.send(res, "OK", "User updated successfully", updatedUser);
};

export const getOrders = async (req: Request, res: Response) => {
  const userId = req.user?._id;
  if (!userId) {
    throw new ApiError("User not found", "UNAUTHORIZED");
  }
  const query = new ApiFeatures(OrderM.find({ user: userId }), req.query as IRequestBody)
    .filter()
    .sort()
    .paginate(await OrderM.countDocuments({ user: userId }))
    .limitFields();
  const { mongooseQuery } = await query;
  const orders = await mongooseQuery;
  if (!orders) {
    throw new ApiError("No orders found", "NOT_FOUND");
  }
  return ApiSuccess.send(res, "OK", "Orders retrieved successfully", orders);
};
