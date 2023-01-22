import { Router } from "express";
import {
  addQuizResponse,
  getQuizResponseById,
} from "../controllers/quizResponse.js";

const quizResponseRouter = Router();

quizResponseRouter
  .post("/", addQuizResponse)
  .get("/:quizID", getQuizResponseById);

export default quizResponseRouter;
