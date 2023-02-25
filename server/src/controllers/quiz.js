import { v2 as cloudinary } from "cloudinary";
import DataUriParser from 'datauri/parser.js';
import path from 'path';

import Quiz from "../models/quiz.js";
import User from "../models/user.js";

import { CATEGORIES, QUIZ_STATUSES } from "../utils/constants.js";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import ResultsFormatter from "../utils/ResultsFormatter.js";

export const getQuizzes = catchAsyncErrors(async (req, res) => {
  await new ResultsFormatter(Quiz.find(), req.query)
    .sortByDate()
    .search()
    .filter()
    .paginate()
    .onlyActive()
    .exec(res);
});

export const getAuthUserQuizzes = catchAsyncErrors(async (req, res) => {
  await new ResultsFormatter(Quiz.find(), req.query)
    .sortByDate()
    .search()
    .filter()
    .paginate()
    .exec(res);
});

export const getUserQuizzes = catchAsyncErrors(async (req, res) => {
  const quiz = await Quiz.findOne({ _id: req.params.id })
    .populate("createdBy", "avatar")
    .exec();

  if (quiz) {
    return res.json({ data: quiz });
  }

  res.status(404).json({ success: false, message: "Nothing Found" });
});

export const getQuizBySlug = catchAsyncErrors(async (req, res) => {
  const quiz = await Quiz.findOne({ slug: req.params.slug })
    .populate("createdBy", "avatar")
    .exec();

  if (quiz) {
    return res.json({ data: quiz });
  }
  res.status(404).json({ success: false, message: "Nothing Found" });
});

export const deleteQuiz = catchAsyncErrors(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user)
    return res
      .status(404)
      .json({ success: false, message: "No user found with that ID" });

  const quiz = await Quiz.findOneAndDelete({
    _id: req.params.id,
    createdBy: user.id,
  }).exec();

  if (quiz) {
    user.quizzes = user.quizzes.filter((_id) => quiz.id != _id);
    await user.save();
  }
  res.status(204).json({ success: true, message: "Successfully Deleted" });
});

export const updateQuiz = catchAsyncErrors(async (req, res) => {
  const { title, description, surveySchema, category, image, status, time } =
    req.body;
  const props = {
    title,
    description,
    surveySchema,
    category,
    image,
    status,
    time,
  };

  const _image = req.file;
  if (_image && _image.mimetype.startsWith("image/")) {
    const { content } = new DataUriParser().format(path.extname(_image.originalname), _image.buffer);
    const uploadResponse = await cloudinary.uploader.upload(content, {
      filename_override: _image.originalname,
    });
    props.image = uploadResponse.secure_url;
  }

  const user = await User.findById(req.user.id);
  if (!user)
    return res
      .status(404)
      .json({ success: false, message: "No user found with that ID" });

  const quiz = await Quiz.findOne({
    _id: req.params.id,
    createdBy: user.id,
  });
  Object.entries(props).forEach(([key, value]) => {
    if (value) {
      if (key == "category" && !CATEGORIES.includes(value)) return;
      if (key == "status" && !QUIZ_STATUSES.includes(value)) return;

      if (key == "surveySchema") {
        quiz[key] = JSON.parse(value);
        return;
      } else if (key == "time") {
        quiz[key] = Number(time) || 0;
        return;
      } else if (value) {
        quiz[key] = value;
      }
    }
  });

  await quiz.save();

  res.status(200).json({ data: quiz });
});

export const addQuiz = catchAsyncErrors(async (req, res) => {
  let { title, description, surveySchema, category, image, status, time } =
    req.body;

  const _image = req.file;
  if (_image && _image.mimetype.startsWith("image/")) {
    const { content } = new DataUriParser().format(path.extname(_image.originalname), _image.buffer);
    const uploadResponse = await cloudinary.uploader.upload(content, {
      filename_override: _image.originalname,
    });
    image = uploadResponse.secure_url;
  }

  if (!CATEGORIES.includes(category)) category = "misc";
  if (!QUIZ_STATUSES.includes(status)) status = "drafted";

  const newQuiz = new Quiz({
    title,
    description,
    surveySchema: JSON.parse(surveySchema),
    image,
    status: status.toUpperCase(),
    category,
    time: Number(time) || 0,
    createdBy: req.user.id,
  });
  const user = await User.findById(req.user.id);
  const quiz = await newQuiz.save();

  if (user) {
    user.quizzes.push(quiz.id);
    await user.save();
    return res.status(201).json({ data: quiz });
  }

  res
    .status(404)
    .json({ success: false, message: "No user found with that ID" });
});

export const likeQuiz = catchAsyncErrors(async (req, res) => {
  const user = await User.findById(req.user.id);
  if (!user)
    return res
      .status(404)
      .json({ success: false, message: "No user found with that ID" });

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
