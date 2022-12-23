import { Router } from "express";
import { ensureLoggedIn } from "connect-ensure-login";
import Quiz from "../models/quiz.js";
import User from "../models/user.js";

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
  const user = await User.findByIdAndUpdate(req.user.id, {
    $push: {
      quizzes: data._id
    }
  }, { new: true });

  if (user && user.quizzes.includes(quiz.id)) {
    return res.status(201).json(quiz);
  }

  res.status(404).send("User Not Found");
});

export default quizRouter;
