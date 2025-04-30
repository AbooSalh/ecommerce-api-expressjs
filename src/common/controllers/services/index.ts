/* eslint-disable @typescript-eslint/no-explicit-any */

import ApiError from "@/common/utils/api/ApiError";
import { Model } from "mongoose";

export default function baseServices(model: Model<any>) {
  return {
    deleteOne: async (id: string) => {
      const document = await model.findByIdAndDelete(id);
      if (!document) {
        throw new ApiError("Not found", "NOT_FOUND");
      }
      return document;
    },
  };
}
