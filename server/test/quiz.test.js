import assert from "assert";
import supertest from "supertest";

import app from "../src/index.js";
import Quiz from "../src/models/quiz.js";
import User from "../src/models/user.js";
import {
  createTestUser,
  QuizSamples,
  setupTestData,
  USER_ID,
} from "./testHelpers.js";

const api = supertest(app);
let SESSION_COOKIE = "";

beforeEach(async () => {
  SESSION_COOKIE = encodeURIComponent(await createTestUser());
  await setupTestData();
});

describe("GET /api/quizzes", () => {
  it("should retrieve all active quizzes", async () => {
    const response = await api.get("/api/quizzes");

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.body.data.length, 4);

    response.body.data.forEach((quiz) => {
      assert.match(quiz.title, new RegExp("^Test Quiz"));
    });
  });

  it("should retrieve all active quizzes within limits", async () => {
    const response1 = await api.get("/api/quizzes");
    assert.strictEqual(response1.statusCode, 200);
    assert.strictEqual(response1.body.data.length, 4);

    const response2 = await api.get("/api/quizzes?page=2");
    assert.strictEqual(response2.body.data.length, 0);
  });
});

describe("GET /api/quizzes/:id", () => {
  it("should retrieve a single active quiz corresponding to :id", async () => {
    const quizzes = await Quiz.find({ status: "ACTIVE" });

    quizzes.forEach(async (quiz) => {
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

describe("GET /api/quizzes/user", () => {
  it("retrieves all quizzes for a specific user", async () => {
    const response = await api
      .get("/api/quizzes/user")
      .set("Cookie", `connect.sid=${SESSION_COOKIE}`);

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.body.data.length, 3);
  });
});

describe("POST /api/quizzes", () => {
  it("blocks unauthenticated users", async () => {
    const response = await api.post("/api/quizzes");
    assert.strictEqual(response.statusCode, 401);
  });

  it("should create a quiz for auth users", async () => {
    const response = await api
      .post("/api/quizzes")
      .set("Cookie", `connect.sid=${SESSION_COOKIE}`)
      .set("Content-Type", `multipart/form-data`)
      .field("title", "Test Quiz Final")
      .field(
        "description",
        "A test quiz to check if things are working properly."
      )
      .field("surveySchema", `{ "type": "survey.js schema type" }`)
      .field("status", "ACTIVE")
      .field("category", "misc");

    assert.strictEqual(response.statusCode, 201);

    assert.strictEqual(response.body.data.title, "Test Quiz Final");
    assert.strictEqual(
      response.body.data.description,
      "A test quiz to check if things are working properly."
    );
    assert.strictEqual(
      JSON.stringify(response.body.data.surveySchema),
      `{"type":"survey.js schema type"}`
    );
    assert.strictEqual(response.body.data.category, "misc");

    const user = await User.findById(USER_ID);
    assert.strictEqual(user.quizzes.length, 4);
    assert.ok(user.quizzes.includes(response.body.data.id));
  });
});

describe("POST /api/quizzes/:id/likes", () => {
  it("should add/remove a quiz in user liked quizzes", async () => {
    let quiz = await Quiz.findOne({ title: QuizSamples[1].title });
    let response = await api
      .post(`/api/quizzes/${quiz.id}/likes`)
      .set("Cookie", `connect.sid=${SESSION_COOKIE}`);

    quiz = await Quiz.findOne({ _id: response.body.data.id });
    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(quiz.likes, 1);
    let user = await User.findById(USER_ID);
    assert.ok(user.likedQuizzes.includes(quiz.id));

    response = await api
      .post(`/api/quizzes/${quiz.id}/likes`)
      .set("Cookie", `connect.sid=${SESSION_COOKIE}`);

    quiz = await Quiz.findOne({ _id: response.body.data.id });
    assert.strictEqual(quiz.likes, 0);
    user = await User.findById(USER_ID);
    assert.ok(!user.likedQuizzes.includes(quiz.id));
  });
});

describe("PATCH /api/quizzes/:id", () => {
  it("should modify a quiz with related :id", async () => {
    let quiz = await Quiz.findOne({ title: QuizSamples[0].title });
    const response = await api
      .patch(`/api/quizzes/${quiz.id}`)
      .set("Cookie", `connect.sid=${SESSION_COOKIE}`)
      .set("Content-Type", `multipart/form-data`)
      .field("title", "Test Quiz The First")
      .field("image", "https://site.com/logo.png")
      .field(
        "surveySchema",
        `{"elements":["radio",[{"label":"Name","value":"name"}]]}`
      );
    quiz = await Quiz.findOne({ _id: quiz.id });

    assert.strictEqual(response.statusCode, 200);
    assert.strictEqual(response.body.data.title, "Test Quiz The First");
    assert.strictEqual(quiz.title, "Test Quiz The First");
    assert.strictEqual(response.body.data.image, "https://site.com/logo.png");
    assert.strictEqual(quiz.image, "https://site.com/logo.png");
    assert.strictEqual(
      JSON.stringify(response.body.data.surveySchema),
      `{"elements":["radio",[{"label":"Name","value":"name"}]]}`
    );
    assert.strictEqual(
      JSON.stringify(quiz.surveySchema),
      `{"elements":["radio",[{"label":"Name","value":"name"}]]}`
    );

    assert.strictEqual(quiz.status, "ACTIVE");
    assert.strictEqual(quiz.category, "misc");
  });
});

describe("DELETE /api/quizzes/:id", () => {
  it("should delete a specific quiz with corresponding :id", async () => {
    const quizzes = await Quiz.find({ status: "ACTIVE" });

    for (let quiz of quizzes) {
      const res = await api
        .delete(`/api/quizzes/${quiz.id}`)
        .set("Cookie", `connect.sid=${SESSION_COOKIE}`);

      assert.strictEqual(res.statusCode, 204);
      const user = await User.findById(USER_ID);
      assert.ok(!user.quizzes.includes(quiz.id));
    }
  });
});
