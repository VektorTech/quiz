import "./configs/env.config.js";

import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import passport from "passport";
import authRouter from "./routes/auth.js";
import quizRouter from "./routes/quiz.js";

const PORT = 3001;
const MONGODB_URL =
  process.env.NODE_ENV == "test"
    ? process.env.MONGODB_TEST_URL
    : process.env.MONGODB_URL;

mongoose.set("strictQuery", true);
mongoose
  .connect(MONGODB_URL)
  .then((data) =>
    console.log(`Mongo DB is connected to server: ${data.connection.host}`)
  );

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

export const sessionStore = MongoStore.create({
  mongoUrl: MONGODB_URL,
});

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);
app.use(passport.authenticate("session"));

app.use("/api/auth", authRouter);
app.use("/api/quizzes", quizRouter);

if (process.env.NODE_ENV != "test") {
  app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`);
  });
}

export default app;
