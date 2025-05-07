import baseController from "@/common/controllers/handlers";
import Category from "./model";

import { imageHandler } from "@/common/middleware/imageHandler";
const { uploadImage, processImage } = imageHandler(
  "category",
  "image"
);
export const categoryC = {
  ...baseController(Category),
  uploadImage,
  processImage,
};
