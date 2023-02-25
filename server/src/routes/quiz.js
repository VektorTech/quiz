import { Router } from "express";
import multer from "multer";
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

const upload = multer({ storage: multer.memoryStorage() });
quizRouter
  .get("/", getQuizzes)
  .get("/user", isAuth, getAuthUserQuizzes)
  .get("/:id", getUserQuizzes)
  .get("/slug/:slug", getQuizBySlug)
  .delete("/:id", isAuth, deleteQuiz)
  .patch("/:id", isAuth, upload.single("image"), updateQuiz)
  .post("/", isAuth, upload.single("image"), addQuiz)
  .post("/:id/likes", isAuth, likeQuiz);

export default quizRouter;
