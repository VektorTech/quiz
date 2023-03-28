import { Router } from "express";
import {
  addQuizResponse,
  getQuizResponsesById,
  getQuizResponseCountById,
} from "../controllers/quizResponse.js";
import { isAuth } from "../middlewares/isAuth.js";

const quizResponseRouter = Router();

quizResponseRouter
  .post("/", addQuizResponse)
  .get("/:quizID", isAuth, getQuizResponsesById)
  .get("/:quizID/count", getQuizResponseCountById);

export default quizResponseRouter;
