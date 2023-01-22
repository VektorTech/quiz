import { Router } from "express";
import {
  followUser,
  getUserById,
  getUserProfile,
} from "../controllers/user.js";
import { isAuth } from "../middlewares/isAuth.js";

const userRouter = Router();

userRouter
  .get("/me", isAuth, getUserProfile)
  .get("/:id", getUserById)
  .post("/:id/follow", isAuth, followUser);

export default userRouter;
