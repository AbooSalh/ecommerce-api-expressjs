import mongoose, { Schema } from "mongoose";

const categorySchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "Category title is required"],
      unique: [true, "Category title must be unique"],
      minLength: [3, "Category title must be at least 3 characters"],
      maxLength: [32, "Category title must be at most 32 characters"],
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

const Category = mongoose.model("Category", categorySchema);
export default Category;
