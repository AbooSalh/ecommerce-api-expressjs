import mongoose, { Query, Document } from "mongoose";
import ProductM from "../Product/model";

interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  rating: number;
  title: string;
  comment: string;
}

interface IReviewModel extends mongoose.Model<IReview> {
  calcAverageRatings(productId: string): Promise<void>;
}

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "User is required"],
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: [true, "Product is required"],
  },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
    min: [1, "Rating must be at least 1"],
    max: [5, "Rating must be at most 5"],
  },
  title: {
    type: String,
    required: [true, "Title is required"],
    minLength: [3, "Title must be at least 3 characters"],
    maxLength: [100, "Title must be at most 100 characters"],
  },
  comment: {
    type: String,
    required: [true, "Comment is required"],
    minLength: [3, "Comment must be at least 10 characters"],
    maxLength: [1000, "Comment must be at most 1000 characters"],
  },
});
reviewSchema.pre(/^find/, function (this: Query<IReview, IReview>, next) {
  this.populate({ path: "user", select: "name" });
  next();
});

reviewSchema.post("save", async function (this: IReview) {
  await ReviewM.calcAverageRatings(this.product.toString());
});
reviewSchema.post("findOneAndDelete", async function (doc) {
  if (doc) {
    await ReviewM.calcAverageRatings(doc.product.toString());
  }
});
reviewSchema.statics.calcAverageRatings = async function (productId: string) {
  // 1. Aggregation Pipeline
  const result = await this.aggregate([
    // Stage 1: Filter reviews for specific product
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    // Stage 2: Calculate statistics
    {
      $group: {
        _id: "product", // Group all reviews together
        avgRating: { $avg: "$rating" }, // Calculate average of all ratings
        numOfReviews: { $sum: 1 }, // Count total number of reviews
      },
    },
  ]);

  // 2. Update Product with Results
  if (result.length > 0) {
    // If reviews exist, update with calculated values
    await ProductM.findByIdAndUpdate(productId, {
      ratingAvg: Math.round(result[0].avgRating * 10) / 10, // Round to 1 decimal place
      ratings: result[0].numOfReviews, // Set total number of reviews
    });
  } else {
    // If no reviews exist, set both to 0
    await ProductM.findByIdAndUpdate(productId, {
      ratingAvg: 0,
      ratings: 0,
    });
  }
};
const ReviewM = mongoose.model<IReview, IReviewModel>("Review", reviewSchema);

export default ReviewM;
