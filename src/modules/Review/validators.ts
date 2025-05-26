import ApiError from "@/common/utils/api/ApiError";
import { body, check } from "express-validator";
import ReviewM from "./model";
import validatorMiddleware from "@/common/middleware/validators/validator";

const reviewValidator = {
  create: [
    body("product").custom(async (value, { req }) => {
      req.body.user = req.user._id;
      const reviewBefore = await ReviewM.findOne({
        user: req.user._id,
        product: value,
      });
      if (reviewBefore) {
        throw new ApiError(
          "Review already exists - you can't add more than one review for a product",
          "CONFLICT"
        );
      }
      return true;
    }),
    validatorMiddleware,
  ],
  update: [
    check("id").custom(async (value, { req }) => {
      // check if the review is owned by the user
      const review = await ReviewM.findOne({
        _id: value,
        user: req.user._id,
      });
      if (!review) {
        throw new ApiError(
          "Review not found or you are not allowed to update it",
          "NOT_FOUND"
        );
      }
      if (review.user._id.toString() !== req.user._id.toString()) {
        throw new ApiError(
          "You are not allowed to update this review",
          "FORBIDDEN"
        );
      }
      return true;
    }),
    validatorMiddleware,
  ],
  delete: [
    check("id").custom(async (value, { req }) => {
      const review = await ReviewM.findById(value);
      if (!review) {
        throw new ApiError("Review not found", "NOT_FOUND");
      }
      // Allow admin to delete any review
      if (req.user.role === "admin") {
        return true;
      }
      // Regular users can only delete their own reviews
      if (review.user._id.toString() !== req.user._id.toString()) {
        throw new ApiError(
          "You are not allowed to delete this review",
          "FORBIDDEN"
        );
      }
      return true;
    }),
    validatorMiddleware,
  ],
};

export default reviewValidator;
