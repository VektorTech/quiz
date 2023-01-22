import { Router } from "express";
import passport from "passport";

import { logoutUser } from "../controllers/auth.js";

const authRouter = Router();

authRouter.get("/login", passport.authenticate("openidconnect"))
  .get("/login/google", passport.authenticate("openidconnect-google"))
  .post(
    "/login/ropc",
    passport.authenticate("local", {
      failureRedirect: "/",
    }),
    (req, res) => {
      res.json({ message: "OK" });
    }
  )
  .get(
    "/redirect",
    passport.authenticate("openidconnect", {
      successRedirect: "http://localhost:3000/me",
      failureRedirect: "/api/auth/login",
      failureMessage: true,
    })
  )
  .get("/logout", logoutUser);

export default authRouter;
