import assert from "assert";
import supertest from "supertest";
import mongoose from "mongoose";

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

before(async () => {
  SESSION_COOKIE = encodeURIComponent(await createTestUser());
  const quizzes = await Quiz.create(QuizSamples);
  await User.findByIdAndUpdate(USER_ID, {
    $set: { quizzes: quizzes.map((quiz) => quiz.id) },
  });
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

    assert.strictEqual(response.statusCode, 201);

    assert.strictEqual(response.body.data.title, payload.title);
    assert.strictEqual(response.body.data.description, payload.description);
    assert.strictEqual(response.body.data.surveySchema, payload.surveySchema);
    assert.strictEqual(response.body.data.category, payload.category);

    const user = await User.findById(USER_ID);
    assert.strictEqual(user.quizzes.length, 4);
  });

  it("blocks unauthenticated users", async () => {
    const response = await api.post("/api/quizzes");
    assert.strictEqual(response.statusCode, 302);
  });
});

describe("GET /api/quizzes", () => {
  it("should retrieve all quizzes", async () => {
    const response = await api.get("/api/quizzes");

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.body.data.length, 4);

    response.body.data.forEach((quiz) => {
      assert.match(quiz.title, new RegExp("^Test Quiz"));
    });
  });

  it("should retrieve all quizzes within limits", async () => {
    const response1 = await api.get("/api/quizzes?limit=2");
    assert.strictEqual(response1.statusCode, 200);
    assert.strictEqual(response1.body.data.length, 2);

    const response2 = await api.get("/api/quizzes?skip=2&limit=2");
    assert.strictEqual(response2.body.data.length, 2);
  });
});

describe("GET /api/quizzes/:id", () => {
  it("should retrieve a single quiz corresponding to :id", async () => {
    const response = await api.get("/api/quizzes");

    response.body.data.forEach(async (quiz) => {
      const quizInfo = await api.get(`/api/quizzes/${quiz.id}`);
      assert.strictEqual(quizInfo.statusCode, 200);
      assert.strictEqual(quizInfo.body.data.title, quiz.title);
      assert.strictEqual(quizInfo.body.data.description, quiz.description);
      assert.strictEqual(quizInfo.body.data.surveySchema, quiz.surveySchema);
      assert.strictEqual(quizInfo.body.data.category, quiz.category);
      assert.strictEqual(quizInfo.body.data.createdBy, quiz.createdBy);
    });
  });
});

describe("DELETE /api/quizzes/:id", () => {
  it("should delete a specific quiz with corresponding :id", async () => {
    const response = await api.get("/api/quizzes");

    for (let quiz of response.body.data) {
      const res = await api
        .delete(`/api/quizzes/${quiz.id}`)
        .set("Cookie", `connect.sid=${SESSION_COOKIE}`);

      assert.strictEqual(res.statusCode, 204);
      const user = await User.findById(USER_ID);
      assert.ok(!user.quizzes.includes(quiz.id));
    }
  });
});

after(async () => {
  await SessionModel.deleteMany();
  await User.deleteMany();
  await Quiz.deleteMany();

  await sessionStore.close();
  await mongoose.connection.close();
});
