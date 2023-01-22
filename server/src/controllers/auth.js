import passport from "passport";
import OpenIDConnectStrategy from "passport-openidconnect";
import LocalStrategy from "passport-local";
import jwt_decode from "jwt-decode";
import qs from "querystring";

import User from "../models/user.js";
import fetch from "node-fetch";
import { openIDOptions } from "../configs/general.config.js";

const openIDVerify = async function verify(
  issuer,
  profile,
  context,
  idToken,
  cb
) {
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
        picture_url: decodedUser.picture,
      },
    });
    await newUser.save();
    return cb(null, newUser);
  }
};

class OpenIDConnectGoogleStrategy extends OpenIDConnectStrategy {
  constructor(options, verify) {
    options.authorizationURL += "?connection=google-oauth2";
    super(options, verify);
    this.name = "openidconnect-google";
  }
}

passport.use(new OpenIDConnectStrategy(openIDOptions, openIDVerify));

passport.use(new OpenIDConnectGoogleStrategy(openIDOptions, openIDVerify));

passport.use(
  new LocalStrategy(async (username, password, done) => {
    const postData = qs.stringify({
      grant_type: "password",
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/`,
      username,
      password,
      scope: "openid profile email",
    });

    const tokenRequest = await fetch(
      `${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: postData,
      }
    );
    const { access_token, id_token } = await tokenRequest.json();

    const decodedUser = jwt_decode(id_token);

    const user = await User.findOne({
      $or: [{ email: decodedUser.email }, { user_id: decodedUser.sub }],
    });

    if (user) {
      return done(null, user);
    } else {
      const newUser = new User({
        name: decodedUser.name,
        user_id: decodedUser.sub,
        email: decodedUser.email,
        isVerified: decodedUser.email_verified,
        avatar: {
          username: decodedUser.nickname,
          picture_url: decodedUser.picture,
        },
      });
      await newUser.save();
      return done(null, newUser);
    }
  })
);

passport.serializeUser(function (user, cb) {
  process.nextTick(function () {
    cb(null, {
      id: user._id,
      username: user.avatar.username,
      picture: user.avatar.picture_url,
    });
  });
});

passport.deserializeUser(function (user, cb) {
  process.nextTick(function () {
    return cb(null, user);
  });
});

export const logoutUser = function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    const params = {
      client_id: process.env.AUTH0_CLIENT_ID,
      returnTo: `${process.env.CLIENT_ADDR}/`,
    };
    res.redirect(
      `${process.env.AUTH0_ISSUER_BASE_URL}/v2/logout?${qs.stringify(params)}`
    );
  });
};
