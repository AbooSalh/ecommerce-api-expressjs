import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Too short product title"],
      maxlength: [100, "Too long product title"],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      minlength: [20, "Too short product description"],
    },
    quantity: {
      type: Number,
      required: [true, "Product quantity is required"],
    },
    sold: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      trim: true,
    },
    discount: {
      type: Number,
      trim: true,
      default: 0,
      min: [1, "Discount must be at least 1%"],
      max: [100, "Discount must be at most 100%"],
    },
    colors: [String],
    imageCover: {
      type: String,
      required: [true, "Product image cover is required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must belong to a category"],
    },
    subCategories: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "SubCategory",
      },
    ],
    brand: {
      type: mongoose.Schema.ObjectId,
      ref: "Brand",
    },
    ratings: [
      {
        type: Number,
        min: [1, "Rating must be at least 1.0"],
        max: [5, "Rating must be at most 5.0"],
      },
    ],
    ratingAvg: {
      type: Number,
    },
  },
  { timestamps: true }
);

// Pre-save hook to generate slug from title
productSchema.pre("save", function (next) {
  if (this.isModified("title") && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

// Pre-update hook to generate slug from title
productSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as {
    $set?: {
      title?: string;
      slug?: string;
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

const ProductM = mongoose.model("Product", productSchema);

export default ProductM;
