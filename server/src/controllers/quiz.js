import Quiz from "../models/quiz.js";
import QuizResponse from "../models/quizResponse.js";
import User from "../models/user.js";
import { CATEGORIES, QUIZ_STATUSES } from "../utils/constants.js";
import { QUIZ_RESULTS_LIMIT } from "../configs/general.config.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";

export const getQuizzes = catchAsyncErrors(async (req, res) => {
  const { page = 1, category = "", search = "" } = req.query;

  const index = (Number(page) - 1) * QUIZ_RESULTS_LIMIT;
  const filter = {
    status: "ACTIVE",
    category: new RegExp(category, "i"),
    title: new RegExp(search, "i"),
  };
  const total = await Quiz.count(filter);
  const pages = Math.ceil(total / QUIZ_RESULTS_LIMIT);

  const quizzes = await Quiz.find(filter)
    .sort({ createdAt: -1 })
    .skip(index || 0)
    .limit(QUIZ_RESULTS_LIMIT)
    .populate("createdBy", "avatar");

  res.json({
    data: quizzes,
    count: total,
    perPage: QUIZ_RESULTS_LIMIT,
    numPages: pages,
    currentPage: Number(page),
    currentPageCount: quizzes.length,
  });
});

export const getAuthUserQuizzes = catchAsyncErrors(async (req, res) => {
  const user = await User.findById(req.user.id);
  const { page = 1, category = "", search = "" } = req.query;

  const index = (Number(page) - 1) * QUIZ_RESULTS_LIMIT;
  const filter = {
    status: "ACTIVE",
    category: new RegExp(category, "i"),
    title: new RegExp(search, "i"),
    createdBy: user.id,
  };
  const total = await Quiz.count(filter);
  const pages = Math.ceil(total / QUIZ_RESULTS_LIMIT);

  const quizzes = await Quiz.find(filter)
    .sort({ createdAt: -1 })
    .skip(index || 0)
    .limit(QUIZ_RESULTS_LIMIT)
    .populate("createdBy", "avatar");

  res.json({
    data: quizzes,
    count: total,
    perPage: QUIZ_RESULTS_LIMIT,
    numPages: pages,
    currentPage: Number(page),
    currentPageCount: quizzes.length,
  });
});

export const getUserQuizzes = catchAsyncErrors(async (req, res) => {
  const quiz = await Quiz.findOne({ _id: req.params.id })
    .populate("createdBy", "avatar")
    .exec();

  if (quiz) {
    return res.json({ data: quiz });
  }
  res.status(404).send("Nothing Found");
});

export const getQuizBySlug = catchAsyncErrors(async (req, res) => {
  const quiz = await Quiz.findOne({ slug: req.params.slug })
    .populate("createdBy", "avatar")
    .exec();

  if (quiz) {
    return res.json({ data: quiz });
  }
  res.status(404).send("Nothing Found");
});

export const deleteQuiz = catchAsyncErrors(async (req, res) => {
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

export const updateQuiz = catchAsyncErrors(async (req, res) => {
  const { title, description, surveySchema, category, image, status } =
    req.body;
  const props = { title, description, surveySchema, category, image, status };

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

export const likeQuiz = catchAsyncErrors(async (req, res) => {
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

export const addQuiz = catchAsyncErrors(async (req, res) => {
  let { title, description, surveySchema, category, image, status } = req.body;

  if (!CATEGORIES.includes(category)) category = "misc";
  if (!QUIZ_STATUSES.includes(status)) status = "drafted";

  const newQuiz = new Quiz({
    title,
    description,
    surveySchema,
    image,
    status: status.toUpperCase(),
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
