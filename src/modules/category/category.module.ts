import { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: [true, "Category name must be unique"],
      minLength: [3, "Category name must be at least 3 characters"],
      maxLength: [32, "Category name must be at most 32 characters"],
    },
    // api endpoint
    slug: {
      type: String,
      lowercase: true,
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
