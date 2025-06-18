import { addSlugMiddleware } from "@/common/middleware/mongoose/addSlugMiddleware";
import mongoose from "mongoose";
import bcrypt from "node_modules/bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, trim: true, required: [true, "Name is required"] },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email must be unique"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    passwordChangedAt: Date,
    passwordResetCode: String,
    passwordResetCodeExpires: Date,
    passwordResetVerified: {
      type: Boolean,
      default: undefined,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    addresses: [
      {
        id: mongoose.Schema.Types.ObjectId,
        alias: String,
        details: String,
        phone: String,
        city: String,
        postalCode: String,
        isDefault: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
addSlugMiddleware(userSchema, "name");
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
const UserModel = mongoose.model("User", userSchema);
export default UserModel;

export type UserModel = typeof userSchema;
