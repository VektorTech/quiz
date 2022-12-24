import { Router } from "express";
import { ensureLoggedIn } from "connect-ensure-login";

import User from "../models/user.js";

const userRouter = Router();

userRouter.get("/:id", ensureLoggedIn(), async (req, res) => {
  if (req.params.id == req.user.id) {
    const user = await User.findById(req.user.id).populate([
      "quizzes",
      "likedQuizzes",
    ]);
    return res.json({ data: { ...user.toObject(), user_id: null } });
  }

  res.status(401).send("Unauthorized");
});

export default userRouter;
