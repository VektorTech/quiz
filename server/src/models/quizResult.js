import { Schema, model, Types } from "mongoose";

const QuizResultSchema = new Schema(
  {
    quiz: { type: Types.ObjectId, ref: "Quiz" },
    responses: { type: String, required: [true, "No responses provided"] },
  },
  {
    timestamps: true,
  }
);

export default model("QuizResult", QuizResultSchema);
