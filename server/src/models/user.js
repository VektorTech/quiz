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
      picture_url: {
        type: String,
        validate: [validator.isURL, "Picture must point to a valid URL"],
      },
      bio: { type: String, maxlength: 300 },
    },
    country_abbr: { type: String, length: 2 },
    gender: {
      type: String,
      default: null,
      enum: ["male", "female", "other", null],
    },
    quizzes: { type: [Types.ObjectId], ref: "Quiz" },
    likedQuizzes: { type: [Types.ObjectId], ref: "Quiz" },
    isBanned: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    role: { type: String, default: "USER" },
    followers: { type: [Types.ObjectId], ref: "User" },
  },
  {
    timestamps: true,

    methods: {
      getUserDetails() {
        return {
          ...this._doc,
          id: this._doc._id,
          user_id: undefined,
          _id: undefined,
          __v: undefined,
          role: undefined,
        };
      },
    },
    virtuals: {
      followersCount: {
        get() {
          return this.followers.length;
        },
      },
    },
  }
);

export default model("User", UserSchema);
