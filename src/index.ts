import { Application } from "express";
import brandR from "./modules/Brands/routes";
import categoryRouter from "./modules/category/routes";
import productR from "./modules/Product/routes";
import reviewR from "./modules/Review/routes";
import subCategoryR from "./modules/SubCategory/routes";
import authRouter from "./modules/User/auth/auth.route";
import userR from "./modules/User/routes";
import couponR from "./modules/Coupon/routes";

export const mountRoutes = (app: Application) => {
  app.use("/api/categories", categoryRouter);
  app.use("/api/sub-categories", subCategoryR);
  app.use("/api/brands", brandR);
  app.use("/api/products", productR);
  app.use("/api/users", userR);
  app.use("/api/auth", authRouter);
  app.use("/api/reviews", reviewR);
  app.use("/api/coupons", couponR);
};
