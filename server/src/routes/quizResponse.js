import { Router } from "express";
import Quiz from "../models/quiz.js";
import QuizResponse from "../models/quizResponse.js";

const quizResponseRouter = Router();

quizResponseRouter.post("/", async (req, res) => {
  const { quiz: quizID, answers, meta } = req.body;
  const quiz = await Quiz.findById(quizID);

  if (quiz && quiz.status == "ACTIVE") {
    const quizResponse = new QuizResponse({
      quiz: quiz.id,
      answers,
      meta
    });
    await quizResponse.save();

    return res.status(201).json({ data: quizResponse });
  }
  res.status(404).send("Quiz Not Found");
});

quizResponseRouter.get("/:quizID", async (req, res) => {
  const quiz = await Quiz.findById(req.params.quizID);

  if (quiz) {
    const responses = await QuizResponse.find({ quiz: quiz.id });
    return res.json({ data: responses });
  }
  res.status(404).send("Quiz Not Found");
});

export default quizResponseRouter;
