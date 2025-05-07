/* eslint-disable @typescript-eslint/no-explicit-any */
import multer from "multer";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import expressAsyncHandler from "express-async-handler";
import type { Request, Response, NextFunction } from "express";
import ApiError from "@/common/utils/api/ApiError";

export const imageHandler = (savePath: string, fieldName: string) => {
  const storage = multer.memoryStorage();

  const fileFilter = (_req: Request, file: Express.Multer.File, cb: any) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(
        new ApiError("Only image files are allowed", "BAD_REQUEST"),
        false
      );
    }
    cb(null, true);
  };
  const uploadImage = multer({ storage, fileFilter }).single(fieldName);
  const processImage = expressAsyncHandler(
    async (req: Request, _res: Response, next: NextFunction) => {
      if (!req.file) {
        return next(new ApiError("No file uploaded", "BAD_REQUEST"));
      }

      const fileName = `${uuidv4()}.jpeg`;
      const outputDir = path.join("public", "uploads", savePath);
      const outputPath = path.join(outputDir, fileName);

      // Ensure directory exists
      fs.mkdirSync(outputDir, { recursive: true });

      await sharp(req.file.buffer)
        .resize(600, 600)
        .toFormat("jpeg")
        .jpeg({ quality: 90 })
        .toFile(outputPath);

      req.body.image = `/uploads/${savePath}/${fileName}`;
      next();
    }
  );
  return { uploadImage, processImage };
};

export default imageHandler;