import mongoose, { Schema } from "mongoose";
import slugify from "slugify";
export interface ICategory {
  title: string;
  image: string;
}
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

// Pre-save hook to generate slug from title
categorySchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});
categorySchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as {
    $set?: {
      slug: string;
      title?: string;
    };
  };

  if (update.$set?.title) {
    update.$set.slug = slugify(update.$set.title, {
      lower: true,
      strict: true,
    });
  }
  next();
});
const Category = mongoose.model("Category", categorySchema);

export default Category;
