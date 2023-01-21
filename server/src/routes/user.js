import { ensureLoggedIn } from "connect-ensure-login";
import { Router } from "express";

import User from "../models/user.js";

const userRouter = Router();

userRouter.get("/me", ensureLoggedIn({ redirectTo: "http://localhost:3000/" }), async (req, res) => {
  const user = await User.findById(req.user.id).populate([
    "quizzes",
    "likedQuizzes",
  ]);
  const following = (
    await User.find({ followers: { $eq: user.id } })
  ).map(user => user.id);

  res.json({ ...user.getUserDetails(), following, isAuth: true });
});

userRouter.get("/:id", async (req, res) => {
  const isAuth = req.params.id == req.user?.id;
  const user = await User.findById(req.params.id).select({
    role: false,
    user_id: false,
  })
    .select({
      name: isAuth,
      email: isAuth,
      gender: isAuth,
    })
    .populate([
      "quizzes",
      "likedQuizzes",
    ]).exec();

  const following = (
    await User.find({ followers: { $eq: user.id } })
  ).map(user => user.id);

  res.json({
    data: {
      ...user.getUserDetails(),
      following,
      isAuth,
    },
  });
});

userRouter.post("/:id/follow", ensureLoggedIn({ redirectTo: "http://localhost:3000/" }), async (req, res) => {
  if (req.params.id == req.user.id) {
    res.status(401).send("Unauthorized");
  }
  const user = await User.findById(req.params.id);

  if (user.followers.includes(req.user.id)) {
    user = user.followers.filter(id => id != req.user.id)
  } else {
    user.followers.push(req.user.id);
  }
  user.save();

  res.send("Success");
});

export default userRouter;
