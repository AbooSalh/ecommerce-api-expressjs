import baseController from "@/common/controllers/handlers";
import ProductM from "./model";

export const productC = {
  ...baseController(ProductM, ["ratings", "sold", "ratingAvg"]),
};
