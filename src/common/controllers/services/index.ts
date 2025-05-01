/* eslint-disable @typescript-eslint/no-explicit-any */

import ApiError from "@/common/utils/api/ApiError";
import { filterExcludedKeys } from "@/common/utils/filterExcludedKeys";
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
    update: async (
      id: string,
      updatedData: Partial<any>,
      excludeData: string[] = []
    ) => {
      const filteredData = filterExcludedKeys(updatedData, excludeData);

      const product = await model.findByIdAndUpdate(
        id,
        { $set: filteredData },
        { new: true, runValidators: true }
      );
      if (!product) {
        throw new ApiError("Not found", "NOT_FOUND");
      }
      return product;
    },
    create: async (data: any, excludeData: string[] = []) => {
      const filteredData = filterExcludedKeys(data, excludeData);
      const document = await model.create(filteredData);
      return document;
    },
    getOne: async (id: string) => {
      const document = await model.findById(id);
      if (!document) {
        throw new ApiError("Not found", "NOT_FOUND");
      }
      return document;
    },
  };
}
