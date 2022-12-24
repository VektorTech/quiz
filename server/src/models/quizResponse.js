import { Schema, model, Types } from "mongoose";

const QuizResponseSchema = new Schema(
  {
    quiz: { type: Types.ObjectId, ref: "Quiz", required: true },
    answers: {
      type: String,
      required: [true, "No answers provided in response"],
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

export default model("QuizResult", QuizResponseSchema);