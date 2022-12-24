import mongoose from "mongoose";

import { sessionStore } from "../src/index.js";
import Quiz from "../src/models/quiz.js";
import User from "../src/models/user.js";
import { SessionModel } from "./testHelpers.js";

export async function mochaGlobalTeardown() {
  await SessionModel.deleteMany();
  await User.deleteMany();
  await Quiz.deleteMany();

  await sessionStore.close();
  await mongoose.connection.close();
}
