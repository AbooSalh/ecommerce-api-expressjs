import { addSlugMiddleware } from "@/common/middleware/mongoose/addSlugMiddleware";
import mongoose, { Schema } from "mongoose";
const brandSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "brand title is required"],
      unique: [true, "brand title must be unique"],
      minLength: [3, "brand title must be at least 3 characters"],
      maxLength: [32, "brand title must be at most 32 characters"],
    },
    // api endpoint
    slug: {
      type: String,
      lowercase: true,
      unique: [true, "slug must be unique"],
    },
    image: {
      type: String,
    },
  },
  //   mongoose options
  {
    // timestamps for createdAt and updatedAt
    timestamps: true,
  }
);

addSlugMiddleware(brandSchema, "title");
const BrandM = mongoose.model("Brand", brandSchema);

export default BrandM;
