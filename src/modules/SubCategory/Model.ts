import mongoose, { Schema, Document, ObjectId } from "mongoose";
import slugify from "slugify";

export interface ISubCategory extends Document {
  title: string;
  category: ObjectId;
  slug?: string;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const subCategorySchema = new Schema<ISubCategory>(
  {
    title: {
      type: String,
      required: [true, "SubCategory title is required"],
      unique: [true, "SubCategory title must be unique"],
      minLength: [3, "SubCategory title must be at least 3 characters"],
      maxLength: [32, "SubCategory title must be at most 32 characters"],
      trim: true,
    },
    slug: {
      type: String,
      lowercase: true,
    },
    image: {
      type: String,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
  },
  {
    timestamps: true,
  }
);

subCategorySchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

const SubCategoryModel = mongoose.model<ISubCategory>(
  "SubCategory",
  subCategorySchema
);

export default SubCategoryModel;
