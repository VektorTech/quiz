import { Router } from "express";

import User from "../models/user.js";

const userRouter = Router();

userRouter.get("/:id", async (req, res) => {
  const user = await User.findById(req.user.id).populate([
    "quizzes",
    "likedQuizzes",
  ]);
  const isCurrent = req.params.id == req.user.id;

  res.json({
    data: {
      ...user.toObject(),
      role: null,
      user_id: null,
      name: isCurrent ? user.name : null,
      email: isCurrent ? user.email : null,
      gender: isCurrent ? user.gender : null,
    },
  });
});

export default userRouter;
