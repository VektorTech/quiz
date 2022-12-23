import { Router } from "express";
import { ensureLoggedIn } from "connect-ensure-login";
import Quiz from "../models/quiz.js";

const quizRouter = Router();

quizRouter.get("/", (req, res) => {});

quizRouter.post("/", ensureLoggedIn(), async (req, res) => {
  const { title, description, surveySchema, category } = req.body;

  const newQuiz = new Quiz({
    title,
    description,
    surveySchema,
    category,
    createdBy: req.user.id
  });
  const quiz = await newQuiz.save();
  res.status(201).json(quiz);
});

export default quizRouter;
