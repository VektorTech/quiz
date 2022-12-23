import { Schema, model, Types } from "mongoose";
import validator from "validator";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      minlength: [3, "Name should be at least 3 characters long"],
      maxlength: [128, "Name should not be more than 128 characters long"],
    },
    user_id: { type: String, required: true },
    email: {
      type: String,
      required: [true, "Please enter your email"],
      validate: [validator.isEmail, "Please enter a valid email"],
      unique: true,
    },
    avatar: {
      username: { type: String, required: [true, "Please enter a username"] },
      image_url: {
        type: String,
        validate: [validator.isURL, "Image must point to a valid URL"],
      },
      bio: { type: String, maxlength: 300 },
    },
    country_abbr: { type: String, length: 2 },
    gender: {
      type: String,
      default: null,
      enum: ["male", "female", "other", null],
    },
    likedQuizzes: { type: [Types.ObjectId], ref: "Quiz" },
    isBanned: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    role: { type: String, default: "user" },
    followers: { type: [Types.ObjectId], ref: "User" },
  },
  {
    timestamps: true,
  }
);

export default model("User", UserSchema);
