import { Router } from "express";
import { ensureLoggedIn } from "connect-ensure-login";
import Quiz from "../models/quiz.js";
import User from "../models/user.js";

const quizRouter = Router();

quizRouter.get("/quizzes", (req, res) => {});

quizRouter.post("/quizzes", ensureLoggedIn(), async (req, res) => {
  const { title, description, surveySchema, category } = req.body;

  const newQuiz = new Quiz({
    title,
    description,
    surveySchema,
    category,
    createdBy: req.user.id
  });
  const data = await newQuiz.save();
  await User.findByIdAndUpdate(req.user.id, {
    $push: {
      quizzes: data._id
    }
  });

  res.status(201).json(data);
});

export default quizRouter;
