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
    image: {
      type: String,
      default: "/uploads/images/default.jpg",
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email must be unique"],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      unique: [true, "Phone number must be unique"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      // select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
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
