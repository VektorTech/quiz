import { Router } from "express";

const quizResponseRouter = Router();

quizResponseRouter.post("/", (req, res) => {
  res.status(201).json({});
});

export default quizResponseRouter;
