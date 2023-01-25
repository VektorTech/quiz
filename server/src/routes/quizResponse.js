import { Router } from "express";
import {
  addQuizResponse,
  getQuizResponseById,
  getQuizResponseCountById,
} from "../controllers/quizResponse.js";

const quizResponseRouter = Router();

quizResponseRouter
  .post("/", addQuizResponse)
  .get("/:quizID", getQuizResponseById)
  .get("/:quizID/count", getQuizResponseCountById);

export default quizResponseRouter;
