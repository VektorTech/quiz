import { Router } from "express";

import {
  addQuiz,
  deleteQuiz,
  getAuthUserQuizzes,
  getQuizBySlug,
  getQuizzes,
  getUserQuizzes,
  likeQuiz,
  updateQuiz,
} from "../controllers/quiz.js";
import { isAuth } from "../middlewares/isAuth.js";

const quizRouter = Router();

quizRouter.get("/", getQuizzes)
  .get("/user", isAuth, getAuthUserQuizzes)
  .get("/:id", getUserQuizzes)
  .get("/slug/:slug", getQuizBySlug)
  .delete("/:id", isAuth, deleteQuiz)
  .patch("/:id", isAuth, updateQuiz)
  .post("/:id/likes", isAuth, likeQuiz)
  .post("/", isAuth, addQuiz);

export default quizRouter;
