import "./configs/env.config.js";

import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import passport from "passport";
import cors from "cors";

import authRouter from "./routes/auth.js";
import quizRouter from "./routes/quiz.js";
import quizResponseRouter from "./routes/quizResponse.js";
import userRouter from "./routes/user.js";
import errorHandler from "./middlewares/errorHandler.js";

const MONGODB_URL =
  process.env.NODE_ENV == "test"
    ? process.env.MONGODB_TEST_URL
    : process.env.MONGODB_URL;

mongoose.set("strictQuery", true);

export const mongooseClient = mongoose
  .connect(MONGODB_URL)
  .then((data) =>
    console.log(`Mongo DB is connected to server: ${data.connection.host}`)
  )
  .catch(() => console.error("Error Connecting to DB"));

export const sessionStore = MongoStore.create({
  mongoUrl: MONGODB_URL,
});

const app = express();

app.set('trust proxy', 1);
app.use(cors({ origin: [process.env.CLIENT_ADDR], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
    cookie: {
      sameSite: app.get('env') === 'production' ? "none" : false,
      maxAge: 24 * 60 * 60 * 1000,
      secure: app.get('env') === 'production',
    }
  })
);
app.use(passport.authenticate("session"));

app.get("/", (req, res) => {
  res.send(`
    Quiz API Server Is Live
    <br>
    Built by Kenny Sutherland
    <a target='_blank' href='https://github.com/VektorTech'>@VektorTech</a>
  `);
});
app.use("/api/auth", authRouter);
app.use("/api/quizzes", quizRouter);
app.use("/api/responses", quizResponseRouter);
app.use("/api/users", userRouter);

app.all("*", (req, res, next) => {
  const err = new Error(`${req.originalUrl} Not Found!`);
  err.status = 404;
  next(err);
});

app.use(errorHandler);

export default app;
