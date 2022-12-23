import mongoose from "mongoose";
import supertest from "supertest";
import app, { sessionStore } from "../src/index.js";

const api = supertest(app);

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
    const response = await api.post("/api/quizzes")
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

afterAll(() => {
  sessionStore.close();
  mongoose.connection.close();
});


