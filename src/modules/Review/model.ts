import mongoose, { Query, Document } from "mongoose";

interface IReview extends Document {
  user: mongoose.Types.ObjectId;
  product: mongoose.Types.ObjectId;
  rating: number;
  title: string;
  comment: string;
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
const ReviewM = mongoose.model("Review", reviewSchema);

export default ReviewM;
