import express from "express";
import { UserC as c } from "./controller";
import { imageUploader } from "@/common/middleware/imageHandler";
import authMiddleware from "@/common/middleware/auth";
import WishlistC from "./wishlist/controller";
import addressR from "./address/routes";
import cartR from "@/modules/Cart/routes";


const userR = express.Router();
// Account deletion (code verification required)
userR.post(
  "/send-delete-account-code",
  authMiddleware(),
  c.sendDeleteAccountCode.validator,
  c.sendDeleteAccountCode.handler
);
userR.delete(
  "/delete-account",
  authMiddleware(),
  c.deleteAccount.validator,
  c.deleteAccount.handler
);

const { upload, processImages } = imageUploader("user", [
  { name: "image", maxCount: 1 },
]);

// Wishlist routes
userR.post(
  "/wishlist",
  authMiddleware(),
  WishlistC.addToWishlist.validator,
  WishlistC.addToWishlist.handler
);
userR.delete(
  "/wishlist",
  authMiddleware(),
  WishlistC.removeFromWishlist.validator,
  WishlistC.removeFromWishlist.handler
);
userR.get(
  "/wishlist",
  authMiddleware(),
  WishlistC.getWishlist.validator,
  WishlistC.getWishlist.handler
);

userR.use("/addresses", addressR);
userR.use("/cart", cartR);

userR
  .route("/")
  .get(authMiddleware("admin"), c.getAll.validator, c.getAll.handler)
  .post(
    authMiddleware("admin"),
    upload,
    processImages,
    c.create.validator,
    c.create.handler
  );
userR.patch(
  "/change-password",
  authMiddleware(),
  c.changePassword.validator,
  c.changePassword.handler
);
userR.get("/profile", authMiddleware(), c.getProfile.handler, c.getOne.handler);
// get user orders
userR.get("/orders", authMiddleware("user"), c.getOrders.handler);
// update auth user
userR.put(
  "/update",
  authMiddleware(),
  c.updateAuthUser.handler,
  c.update.validator,
  c.update.handler
);

userR
  .route("/:id")
  .get(authMiddleware("admin"), c.getOne.validator, c.getOne.handler)
  .put(
    authMiddleware("admin"),
    upload,
    processImages,
    c.update.validator,
    c.update.handler
  )
  .delete(authMiddleware("admin"), c.deleteOne.validator, c.deleteOne.handler);

export default userR;
