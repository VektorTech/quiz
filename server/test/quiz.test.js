import mongoose from "mongoose";
import supertest from "supertest";

import app, { sessionStore } from "../src/index.js";
import Quiz from "../src/models/quiz.js";
import User from "../src/models/user.js";
import { QuizSamples, SESSION_COOKIE, SESSION_ID } from "./helper.js";

const api = supertest(app);

beforeAll(async () => {
  await Quiz.create(QuizSamples);
});

describe("POST /api/quizzes", () => {
  it("should create a quiz for auth users", async () => {
    const payload = {
      title: "Test Quiz",
      description: "A test quiz to check if things are working properly.",
      surveySchema: JSON.stringify({
        type: "survey.js schema type",
      }),
      category: "misc",
    };
    const response = await api
      .post("/api/quizzes")
      .set("Cookie", `connect.sid=${SESSION_COOKIE}`)
      .send(payload);

    expect(response.statusCode).toBe(201);

    expect(response.body.title).toBe(payload.title);
    expect(response.body.description).toBe(payload.description);
    expect(response.body.surveySchema).toBe(payload.surveySchema);
    expect(response.body.category).toBe(payload.category);
  });

  it("blocks unauthenticated users", async () => {
    const response = await api.post("/api/quizzes");
    expect(response.statusCode).toBe(302);
  });
});

afterAll(async () => {
  await Quiz.deleteMany();
  const user = await User.findById(SESSION_ID);
  user.quizzes = [];
  await user.save();

  sessionStore.close();
  mongoose.connection.close();
});
