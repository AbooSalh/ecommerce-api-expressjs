import mongoose, { Schema } from "mongoose";
import slugify from "slugify";
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

// Pre-save hook to generate slug from title
brandSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});
brandSchema.pre("findOneAndUpdate", async function (next) {
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
const BrandM = mongoose.model("Brand", brandSchema);

export default BrandM;
