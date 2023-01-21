import supertest from "supertest";
import assert from "assert";

import app from "../src/index.js";
import { createTestUser, USER_ID } from "./testHelpers.js";

const api = supertest(app);

let SESSION_COOKIE = "";
beforeEach(async () => {
  SESSION_COOKIE = encodeURIComponent(await createTestUser());
});

describe("GET /api/users/:id", () => {
  it("retrieve user details", async () => {
    const userRes = await api
      .get(`/api/users/${USER_ID}`)
      .set("Cookie", `connect.sid=${SESSION_COOKIE}`);

    assert.strictEqual(userRes.statusCode, 200);
    assert.strictEqual(userRes.body.data.id, USER_ID);
    assert.ok(!userRes.body.data.role);
    assert.ok(!userRes.body.data.user_id);
  });
});
