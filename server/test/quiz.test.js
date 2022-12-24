import mongoose from "mongoose";
import supertest from "supertest";

import app, { sessionStore } from "../src/index.js";
import Quiz from "../src/models/quiz.js";
import User from "../src/models/user.js";
import {
  createTestUser,
  QuizSamples,
  SessionModel,
  USER_ID,
} from "./helper.js";

const api = supertest(app);
let SESSION_COOKIE = "";

beforeAll(async () => {
  const quizzes = await Quiz.create(QuizSamples);
  await User.findByIdAndUpdate(USER_ID, {
    $set: { quizzes: quizzes.map((quiz) => quiz.id) },
  });
  SESSION_COOKIE = encodeURIComponent(await createTestUser());
});

describe("POST /api/quizzes", () => {
  it("should create a quiz for auth users", async () => {
    const payload = {
      title: "Test Quiz Final",
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

    expect(response.body.data.title).toBe(payload.title);
    expect(response.body.data.description).toBe(payload.description);
    expect(response.body.data.surveySchema).toBe(payload.surveySchema);
    expect(response.body.data.category).toBe(payload.category);

    const user = await User.findById(USER_ID);
    expect(user.quizzes).toHaveLength(4);
  });

  it("blocks unauthenticated users", async () => {
    const response = await api.post("/api/quizzes");
    expect(response.statusCode).toBe(302);
  });
});

describe("GET /api/quizzes", () => {
  it("should retrieve all quizzes", async () => {
    const response = await api.get("/api/quizzes");

    expect(response.statusCode).toBe(200);
    expect(response.body.data).toHaveLength(4);

    response.body.data.forEach((quiz) => {
      expect(quiz.title).toMatch(new RegExp("^Test Quiz"));
    });
  });

  it("should retrieve all quizzes within limits", async () => {
    const response1 = await api.get("/api/quizzes?limit=2");
    expect(response1.statusCode).toBe(200);
    expect(response1.body.data).toHaveLength(2);

    const response2 = await api.get("/api/quizzes?skip=2&limit=2");
    expect(response2.body.data).toHaveLength(2);
    expect(response2.body.data[0].title).toBe("Test Quiz 2");
  });
});

describe("GET /api/quizzes/:id", () => {
  it("should retrieve a single quiz corresponding to :id", async () => {
    const response = await api.get("/api/quizzes");

    response.body.data.forEach(async (quiz) => {
      const quizInfo = await api.get(`/api/quizzes/${quiz.id}`);
      expect(quizInfo.statusCode).toBe(200);
      expect(quizInfo.body.data.title).toBe(quiz.title);
      expect(quizInfo.body.data.description).toBe(quiz.description);
      expect(quizInfo.body.data.surveySchema).toBe(quiz.surveySchema);
      expect(quizInfo.body.data.category).toBe(quiz.category);
      expect(quizInfo.body.data.createdBy).toBe(quiz.createdBy);
    });
  });
});

describe("DELETE /api/quizzes/:id", () => {
  it("should delete a specific quiz with corresponding :id", async () => {
    const response = await api.get("/api/quizzes");

    response.body.data.forEach(async (quiz) => {
      const res = await api
        .delete(`/api/quizzes/${quiz.id}`)
        .set("Cookie", `connect.sid=${SESSION_COOKIE}`);

      const user = await User.findById(USER_ID);

      expect(user.quizzes.includes(quiz.id)).toBeFalsy();
      expect(res.statusCode).toBe(204);
    });
  });
});

afterAll(async () => {
  await Quiz.deleteMany();
  const user = await User.findById(USER_ID);
  user.quizzes = [];
  await user.save();
  await SessionModel.deleteMany();

  await sessionStore.close();
  await mongoose.connection.close();
});
