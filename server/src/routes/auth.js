import { Router } from "express";
import passport from "passport";
import OpenIDConnectStrategy from "passport-openidconnect";
import jwt_decode from "jwt-decode";
import qs from "querystring";

import User from "../models/user.js";
import { DOMAIN_URL } from "../configs/general.config.js";

passport.use(
  new OpenIDConnectStrategy(
    {
      issuer: `${process.env.AUTH0_ISSUER_BASE_URL}/`,
      authorizationURL: `${process.env.AUTH0_ISSUER_BASE_URL}/authorize`,
      tokenURL: `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
      userInfoURL: `${process.env.AUTH0_ISSUER_BASE_URL}/userinfo`,
      clientID: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      callbackURL: "/api/auth/redirect",
      scope: ["profile", "email"],
    },
    async function verify(issuer, profile, context, idToken, cb) {
      const decodedUser = jwt_decode(idToken);
      const user = await User.findOne({
        $or: [{ email: decodedUser.email }, { user_id: profile.id }],
      });

      if (user) {
        return cb(null, user);
      } else {
        const newUser = new User({
          name: decodedUser.name,
          user_id: profile.id,
          email: decodedUser.email,
          isVerified: decodedUser.email_verified,
          avatar: {
            username: decodedUser.nickname,
            image_url: decodedUser.picture,
          },
        });
        await newUser.save();
        return cb(null, newUser);
      }
    }
  )
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, {
      id: user._id,
      username: user.avatar.username,
      picture: user.avatar.image_url,
    });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

const authRouter = Router();

authRouter.get("/auth/login", passport.authenticate("openidconnect"));

authRouter.get(
  "/auth/redirect",
  passport.authenticate("openidconnect", {
    successRedirect: "/",
    failureRedirect: "/api/auth/login",
    failureMessage: true,
  })
);

authRouter.get("/auth/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    const params = {
      client_id: process.env.AUTH0_CLIENT_ID,
      returnTo: DOMAIN_URL,
    };
    res.redirect(
      `${process.env.AUTH0_ISSUER_BASE_URL}/v2/logout?${qs.stringify(params)}`
    );
  });
});

export default authRouter;
