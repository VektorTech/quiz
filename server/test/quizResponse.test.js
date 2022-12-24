import supertest from "supertest";
import assert from "assert";

import app from "../src/index.js";
import { createTestUser, QuizSamples, USER_ID } from "./testHelpers.js";
import Quiz from "../src/models/quiz.js";
import QuizResponse from "../src/models/quizResponse.js";
import User from "../src/models/user.js";

const api = supertest(app);

beforeEach(async () => {
  encodeURIComponent(await createTestUser());
  await Quiz.deleteMany();
  await QuizResponse.deleteMany();
  const quizzes = await Quiz.create(QuizSamples);
  await User.findByIdAndUpdate(USER_ID, {
    $set: {
      quizzes: quizzes
        .filter((quiz) => quiz.createdBy == USER_ID)
        .map((quiz) => quiz.id),
    },
  });
});

describe("POST /api/responses", () => {
  it("should save a response for a quiz", async () => {
    const quiz = await Quiz.findOne({ title: QuizSamples[0].title });
    const response = await api.post("/api/responses").send({
      quiz: quiz.id,
      answers: "[{}, {}, {}]",
    });

    assert.strictEqual(response.statusCode, 201);

    const allResponses = await QuizResponse.find();
    assert.strictEqual(allResponses.length, 1);
    assert.strictEqual(allResponses[0].quiz.toString(), quiz.id);
  });
});

describe("GET /api/responses/:quizID", async () => {
  const quiz = await Quiz.findOne({ title: QuizSamples[0].title });

  before(async () => {
    await QuizResponse.create({
      quiz: quiz.id,
      answers: "[{1}]"
    });
    await QuizResponse.create({
      quiz: quiz.id,
      answers: "[{2}]"
    });
    await QuizResponse.create({
      quiz: quiz.id,
      answers: "[{3}]"
    });
  });

  it("should get all responses for a quiz", async () => {
    const responses = await api.get(`/api/responses/${quiz.id}`);

    assert.strictEqual(responses.statusCode, 200);
    assert.strictEqual(responses.body.data.length, 3);
  });
});
