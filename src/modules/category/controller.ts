/* eslint-disable @typescript-eslint/no-explicit-any */
import baseController from "@/common/controllers/handlers";
import Category from "./model";
import multer from "multer";
import { v4 as uuidv4 } from "uuid";
import ApiError from "@/common/utils/api/ApiError";
import { Request } from "express";
const storage = multer.diskStorage({
  destination: "uploads/categories",
  filename: function (_req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const filename = `category-${uuidv4()}-${Date.now()}.${ext}`;
    cb(null, filename);
  },
});

const fileFilter = function (_req : Request, file : { mimetype: string; }, cb : any) {
  if (!file.mimetype.startsWith("image/")) {
    return cb(
      new ApiError("Only image files are allowed", "BAD_REQUEST"),
      false
    );
  } else {
    cb(null, true);
  }
};
const upload = multer({ storage, fileFilter });

export const categoryC = {
  ...baseController(Category),
  uploadImage: upload.single("image"),
};
