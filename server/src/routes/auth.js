import { Router } from "express";
import passport from "passport";

import { logoutUser } from "../controllers/auth.js";

const authRouter = Router();

authRouter
  .get("/login", passport.authenticate("openidconnect"))
  .get("/login/google", passport.authenticate("openidconnect-google"))
  .post(
    "/login/ropc",
    passport.authenticate("local", {
      failureRedirect: "/",
    }),
    (req, res) => {
      res.json({ success: true, message: "OK" });
    }
  )
  .get(
    "/redirect",
    passport.authenticate("openidconnect", {
      successRedirect: `${process.env.CLIENT_ADDR}/me`,
      failureRedirect: `${process.env.CLIENT_ADDR}/me`,
      failureMessage: true,
    })
  )
  .get("/logout", logoutUser);

export default authRouter;
