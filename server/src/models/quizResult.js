import { Schema, model, Types } from "mongoose";

const QuizResultSchema = new Schema(
  {
    quiz: { type: Types.ObjectId, ref: "Quiz" },
    responses: { type: String, required: [true, "No responses provided"] },
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

export default model("QuizResult", QuizResultSchema);
