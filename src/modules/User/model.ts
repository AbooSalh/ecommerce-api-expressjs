import mongoose from "mongoose";

const UserModel = mongoose.model(
  "User",
  new mongoose.Schema({
    name: { type: String, trim: true, required: [true, "Name is required"] },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email must be unique"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  })
);
export default UserModel;