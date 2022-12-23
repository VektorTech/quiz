import mongoose from "mongoose";
import supertest from "supertest";
import app from "../src/index.js";

const api = supertest(app);

describe("POST /api/quizzes", () => {
  it("should create a quiz", async () => {
    const payload = {
      title: "Test Quiz",
      description: "A test quiz to check if things are working properly.",
      surveySchema: JSON.stringify({
        type: "survey.js schema type",
      }),
      category: "misc",
    };
    const response = await api.post("/api/quizzes").send(payload);

    expect(response.statusCode).toBe(201);

    expect(response.body.title).toBe(payload.title);
    expect(response.body.description).toBe(payload.description);
    expect(response.body.surveySchema).toBe(payload.surveySchema);
    expect(response.body.category).toBe(payload.category);
  });
});

afterAll(() => {
  mongoose.connection.close();
});
