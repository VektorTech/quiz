import { ensureLoggedIn } from "connect-ensure-login";
import { Router } from "express";

import User from "../models/user.js";

const userRouter = Router();

userRouter.get("/me", ensureLoggedIn("/"), async (req, res) => {
  const user = await User.findById(req.user.id).populate([
    "quizzes",
    "likedQuizzes",
  ]);

  res.json({ ...user.getUserDetails(), isAuth: true });
});

userRouter.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id, {
    role: 0,
    user_id: 0,
    name: isAuth,
    email: isAuth,
    gender: isAuth,
  }).populate([
    "quizzes",
    "likedQuizzes",
  ]);
  const isAuth = req.params.id == req.user.id;

  res.json({
    data: {
      ...user.toObject(),
      isAuth,
    },
  });
});

export default userRouter;
