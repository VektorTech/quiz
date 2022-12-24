import { Router } from "express";
import Quiz from "../models/quiz.js";
import QuizResponse from "../models/quizResponse.js";

const quizResponseRouter = Router();

quizResponseRouter.post("/", async (req, res) => {
  const { quiz: quizID, answers } = req.body;
  const quiz = await Quiz.findById(quizID);

  if (quiz && quiz.status == "active") {
    const quizResponse = new QuizResponse({
      quiz: quiz.id,
      answers
    });
    await quizResponse.save();

    return res.status(201).json({ data: quizResponse });
  }

  res.status(404).send("Quiz Not Found");
});

quizResponseRouter.get("/:quizID", async (req, res) => {
  const quiz = await Quiz.findById(req.params.quizID);

  const responses = await QuizResponse.find({ quiz: quiz.id });

  res.status(201).json({ data: responses });
});

export default quizResponseRouter;
