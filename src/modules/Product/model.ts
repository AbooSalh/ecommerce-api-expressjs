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
      required: true,
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
      min: [1, "discount at least 1%"],
      max: [100, "discount at most 100%"],
    },
    priceAfterDiscount: {
      type: Number,
    },
    colors: [String],

    imageCover: {
      type: String,
      required: [true, "Product Image cover is required"],
    },
    images: [String],
    category: {
      type: mongoose.Schema.ObjectId,
      ref: "Category",
      required: [true, "Product must be belong to category"],
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
        min: [1, "Rating must be above or equal 1.0"],
        max: [5, "Rating must be below or equal 5.0"],
      },
    ],
    ratingAvg:{
        type:Number,
    }

  },
  { timestamps: true }
);

// Pre-save hook to generate slug from title
productSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

productSchema.pre("findOneAndUpdate", async function (next) {
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

const ProductM = mongoose.model("Product", productSchema);

export default ProductM;
