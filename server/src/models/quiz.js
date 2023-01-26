import { Schema, model, Types } from "mongoose";
import validator from "validator";
import QuizResponse from "./quizResponse.js";

import { CATEGORIES, QUIZ_STATUSES } from "../utils/constants.js";
import { nanoid } from "nanoid";
import { toSlug } from "../utils/index.js";

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
      validate: [
        (url, options) => !url || validator.isURL(url, options),
        "Image must point to a valid URL",
      ],
    },
    surveySchema: {
      type: Object,
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
      enum: QUIZ_STATUSES,
      default: "DRAFTED",
    },
    category: {
      type: String,
      enum: CATEGORIES,
      required: [true, "Please select a category"],
    },
    tags: [String],
    slug: String,
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

QuizSchema.pre("save", function (next) {
  if (!this.slug) {
    this.set({ slug: `${nanoid(7)}-${toSlug(this.title)}` });
  }
  next();
});

QuizSchema.pre(
  "findOneAndDelete",
  { document: false, query: true },
  async function (next) {
    const doc = await this.model.findOne(this.getFilter());
    await QuizResponse.deleteMany({ quiz: doc._id });
    next();
  }
);

export default model("Quiz", QuizSchema);
