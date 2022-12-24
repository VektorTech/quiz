import { Router } from "express";
import { ensureLoggedIn } from "connect-ensure-login";
import Quiz from "../models/quiz.js";
import User from "../models/user.js";

const quizRouter = Router();

quizRouter.get("/", async (req, res) => {
  const { limit, skip } = req.query;
  const quizzes = await Quiz.find(null, null, {
    skip: parseInt(skip ?? 0) || 0,
    limit: parseInt(limit) || undefined,
    sort: { createdAt: "desc" },
  });
  res.json({ data: quizzes });
});

quizRouter.get("/:id", async (req, res) => {
  const quiz = await Quiz.findById(req.params.id).exec();

  if (quiz) {
    return res.json({ data: quiz });
  }
  res.status(404).send("Nothing Found");
});

quizRouter.delete("/:id", ensureLoggedIn(), async (req, res) => {
  const quiz = await Quiz.findOneAndDelete({
    _id: req.params.id,
    createdBy: req.user.id,
  }).exec();

  if (quiz) {
    const user = await User.findById(req.user.id);
    user.quizzes = user.quizzes.filter((_quiz) => _quiz.id == quiz.id);
    await user.save();
  }
  res.status(204).send("Successfully Deleted");
});

quizRouter.patch("/:id", ensureLoggedIn(), async (req, res) => {
  const { title, description, surveySchema, category, image } = req.body;
  const props = { title, description, surveySchema, category, image };

  const quiz = await Quiz.findOne({
    _id: req.params.id,
    createdBy: req.user.id,
  });
  Object.keys(props).forEach(
    (prop) => props[prop] && (quiz[prop] = props[prop])
  );
  await quiz.save();

  res.status(200).json({ data: quiz });
});

quizRouter.post("/", ensureLoggedIn(), async (req, res) => {
  const { title, description, surveySchema, category, image } = req.body;

  const newQuiz = new Quiz({
    title,
    description,
    surveySchema,
    category,
    image,
    createdBy: req.user.id,
  });
  const quiz = await newQuiz.save();
  const user = await User.findById(req.user.id);

  if (user) {
    user.quizzes.push(quiz.id);
    await user.save();
    return res.status(201).json({ data: quiz });
  }

  res.status(404).send("User Not Found");
});

export default quizRouter;
