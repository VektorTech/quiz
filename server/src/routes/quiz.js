import { Router } from "express";
import { ensureLoggedIn } from "connect-ensure-login";

import Quiz from "../models/quiz.js";
import User from "../models/user.js";
import { CATEGORIES, QUIZ_STATUSES } from "../utils/constants.js";
import QuizResponse from "../models/quizResponse.js";

const quizRouter = Router();

quizRouter.get("/", async (req, res) => {
  const { limit, skip } = req.query;
  const quizzes = await Quiz.find({ status: "active" }, null, {
    skip: parseInt(skip ?? 0) || 0,
    limit: parseInt(limit) || undefined,
    sort: { createdAt: "desc" },
  });
  res.json({ data: quizzes });
});

quizRouter.get("/user", ensureLoggedIn(), async (req, res) => {
  const user = await User.findById(req.user.id);

  if (user) {
    const quizzes = await Quiz.find({ createdBy: user.id }, null, {
      sort: { createdAt: "desc" },
    });
    return res.json({ data: quizzes });
  }

  res.status(404).send("No user found with that ID");
});

quizRouter.get("/:id", async (req, res) => {
  const quiz = await Quiz.findById(req.params.id, { status: "active" }).exec();

  if (quiz) {
    return res.json({ data: quiz });
  }
  res.status(404).send("Nothing Found");
});

quizRouter.delete("/:id", ensureLoggedIn(), async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).send("No user found with that ID");

  const quiz = await Quiz.findOneAndDelete({
    _id: req.params.id,
    createdBy: user.id,
  }).exec();

  if (quiz) {
    user.quizzes = user.quizzes.filter((_id) => quiz.id != _id);
    await QuizResponse.deleteMany({ quiz: quiz.id });
    await user.save();
  }
  res.status(204).send("Successfully Deleted");
});

quizRouter.patch("/:id", ensureLoggedIn(), async (req, res) => {
  const { title, description, surveySchema, category, image } = req.body;
  const props = { title, description, surveySchema, category, image };

  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).send("No user found with that ID");

  const quiz = await Quiz.findOne({
    _id: req.params.id,
    createdBy: user.id,
  });
  Object.keys(props).forEach((prop) => {
    if (props[prop]) {
      if (prop == "category" && !CATEGORIES.includes(props[prop])) return;
      if (prop == "status" && !QUIZ_STATUSES.includes(props[prop])) return;

      quiz[prop] = props[prop];
    }
  });
  await quiz.save();

  res.status(200).json({ data: quiz });
});

quizRouter.post("/:id/like", ensureLoggedIn(), async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user) return res.status(404).send("No user found with that ID");

  const quiz = await Quiz.findOne({
    _id: req.params.id,
  });

  if (user.likedQuizzes.includes(req.params.id)) {
    user.likedQuizzes = user.likedQuizzes.filter((_id) => quiz.id != _id);
    quiz.likes -= 1;
  } else {
    user.likedQuizzes.push(quiz.id);
    quiz.likes += 1;
  }

  await user.save();
  await quiz.save();

  res.status(200).json({ data: quiz });
});

quizRouter.post("/", ensureLoggedIn(), async (req, res) => {
  let { title, description, surveySchema, category, image, status } = req.body;

  if (!CATEGORIES.includes(category)) category = "misc";
  if (!QUIZ_STATUSES.includes(status)) status = "drafted";

  const newQuiz = new Quiz({
    title,
    description,
    surveySchema,
    image,
    status,
    category,
    createdBy: req.user.id,
  });
  const user = await User.findById(req.user.id);
  const quiz = await newQuiz.save();

  if (user) {
    user.quizzes.push(quiz.id);
    await user.save();
    return res.status(201).json({ data: quiz });
  }

  res.status(404).send("No user found with that ID");
});

export default quizRouter;
