import { Router } from "express";
import Quiz from "../models/quiz";

const quizRouter = Router();

quizRouter.get("/quizzes", (req, res) => {});

quizRouter.post("/quizzes", async (req, res) => {
  const { title, description, surveySchema, category } = req.body;

  const newQuiz = new Quiz({
    title,
    description,
    surveySchema,
    category,
  });
  const data = await newQuiz.save();

  res.status(201).json(data);
});

export default quizRouter;
