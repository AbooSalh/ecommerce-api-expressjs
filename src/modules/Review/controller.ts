import baseController from "@/common/controllers/handlers";
import ReviewM from "./model";

export const reviewController = {
  ...baseController(ReviewM, {
    excludedData: {
      update: ["user", "product"]
    },
  }),
};

export default reviewController;
