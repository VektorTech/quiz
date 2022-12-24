import { Schema, model, Types } from "mongoose";
import validator from "validator";
import { CATEGORIES } from "../utils/constants.js";

const QuizSchema = new Schema(
  {
    title: {
      type: String,
      require: [true, "Please specify quiz title"],
      minlength: [5, "Title must be longer than 5 characters"],
      maxlength: [60, "Title must not exceed 60 characters"],
    },
    description: {
      type: String,
      require: [true, "Please provide a short description"],
      minlength: [30, "Description must be longer than 30 characters"],
      maxlength: [1200, "Description must not exceed 1200 characters"],
    },
    image: {
      type: String,
      validate: [validator.isURL, "Image must point to a valid URL"],
    },
    surveySchema: {
      type: String,
      require: [true, "Please define the shape of your survey"],
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["drafted", "active", "closed"],
      default: "drafted",
    },
    category: {
      type: String,
      enum: CATEGORIES,
      required: [true, "Please select a category"],
    },
  },
  {
    timestamps: true,

    toJSON: {
      transform: (_, obj) => {
        obj.id = obj._id.toString();
        delete obj._id;
        delete obj.__v;
      },
    },
  }
);

export default model("Quiz", QuizSchema);
