import "./configs/env.config.js";

import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
import passport from "passport";
import authRouter from "./routes/auth.js";
import quizRouter from "./routes/quiz.js";

const app = express();
const PORT = 3001;

mongoose.set("strictQuery", true);
mongoose
  .connect(process.env.MONGODB_URL)
  .then((data) =>
    console.log(`Mongo DB is connected to server: ${data.connection.host}`)
  );

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

if (process.env.NODE_ENV != "test") {
  app.use(
    session({
      secret: "some-secret",
      resave: false,
      saveUninitialized: false,
      store: MongoStore.create({ mongoUrl: process.env.MONGODB_URL }),
    })
  );
  app.use(passport.authenticate("session"));
}

app.use("/api", authRouter);
app.use("/api", quizRouter);

if (process.env.NODE_ENV != "test") {
  app.listen(PORT, () => {
    console.log(`Listening on PORT: ${PORT}`);
  });
}

export default app;
