import baseController from "@/common/controllers/handlers";
import CouponM from "./model";

export const CouponC = {
  ...baseController(CouponM),
};

export default CouponC;
