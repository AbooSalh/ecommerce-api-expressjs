import { addSlugMiddleware } from "@/common/middleware/mongoose/addSlugMiddleware";
import mongoose from "mongoose";
const sizeEnum = ["xs", "s", "m", "l", "xl", "xxl"];
type ISize = (typeof sizeEnum)[number];
export type IStock = {
  size: ISize;
  color: string;
  quantity: number;
};
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
    stocks: [
      {
        size: {
          type: String,
          enum: sizeEnum,
          required: [true, "Size is required"],
        },
        color: {
          type: String,
          required: [true, "Color is required"],
        },
        quantity: {
          type: Number,
          required: [true, "Stock quantity is required"],
          min: [0, "Stock quantity cannot be negative"],
          default: 0,
        },
      },
    ],
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
    ratings: Number,
    ratingAvg: Number,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    id: false,
  }
);

addSlugMiddleware(productSchema, "title"); // Add slug middleware for title
productSchema.pre("find", async function (next) {
  this.populate({
    path: "category",
    select: "name",
  });
  next();
});
productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});
const ProductM = mongoose.model("Product", productSchema);

export default ProductM;
