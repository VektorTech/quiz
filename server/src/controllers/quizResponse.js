import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Quiz from "../models/quiz.js";
import QuizResponse from "../models/quizResponse.js";
import User from "../models/user.js";

export const addQuizResponse = catchAsyncErrors(async (req, res) => {
  const { quiz: quizID, answers, meta = {} } = req.body;
  const quiz = await Quiz.findById(quizID);

  if (quiz && quiz.status == "ACTIVE") {
    const quizResponse = new QuizResponse({
      quiz: quiz.id,
      answers: JSON.stringify(answers),
      meta,
    });
    await quizResponse.save();

    return res.status(201).json({ data: quizResponse });
  }
  res.status(404).json({ success: false, message: "Quiz Not Found" });
});

export const getQuizResponsesById = catchAsyncErrors(async (req, res) => {
  const quiz = await Quiz.findById(req.params.quizID);
  const user = await User.findById(req.user.id);

  if (quiz && user.quizzes.includes(quiz.id)) {
    const responses = await QuizResponse.find({ quiz: quiz.id });

    return res.json({
      data: responses.map(response => ({
        ...response.toJSON(),
        answers: JSON.parse(response.answers ?? {})
      })),
    });
  }

  res.status(404).json({ success: false, message: "Quiz Not Found" });
});

export const getQuizResponseCountById = catchAsyncErrors(async (req, res) => {
  const quiz = await Quiz.findById(req.params.quizID);

  if (quiz) {
    const count = await QuizResponse.count({ quiz: quiz.id });
    return res.json({ count });
  }
  res.status(404).json({ success: false, message: "Quiz Not Found" });
});
