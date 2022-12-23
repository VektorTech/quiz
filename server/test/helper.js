import { model, Schema } from "mongoose";
import signature from "cookie-signature";

import User from "../src/models/user.js";

export const SessionModel = model("Session", new Schema({
  _id: String,
  expires: Date,
  session: String
}));

export const USER_ID = "63a5e64718d4974e79fb0649";

export async function createTestUser() {
  const sessionID = "63a5e6336dabf86c93308a07";

  await User.findByIdAndUpdate(USER_ID, {
    _id: USER_ID,
    name: "test user",
    user_id: USER_ID,
    email: "testuser@gmail.com",
    avatar: {
      username: "testuser"
    }
  }, { upsert: true });

  await SessionModel.findOneAndUpdate({ _id: sessionID }, {
    _id: sessionID,
    expires: new Date("9000-01-06T17:54:17.998+00:00"),
    session: JSON.stringify({
      "cookie": {
        "originalMaxAge": null,
        "expires": null,
        "httpOnly": true,
        "path": "/"
      },
      "passport":{
        "user": {
          "id": USER_ID,
          "username": "testuser",
        }
      }
    })
  }, { upsert: true });

  return `s:${signature.sign(sessionID, process.env.COOKIE_SECRET)}`;
}

export const QuizSamples = [
  {
    title: "Test Quiz 1",
    description: "A test quiz to check if things are working properly.",
    surveySchema: JSON.stringify({
      type: "survey.js schema type",
    }),
    createdBy: USER_ID,
    category: "misc",
  },
  {
    title: "Test Quiz 2",
    description: "A test quiz to check if things are working properly.",
    surveySchema: JSON.stringify({
      type: "survey.js schema type",
    }),
    createdBy: USER_ID,
    category: "misc",
  },
  {
    title: "Test Quiz 3",
    description: "A test quiz to check if things are working properly.",
    surveySchema: JSON.stringify({
      type: "survey.js schema type",
    }),
    createdBy: USER_ID,
    category: "misc",
  },
];
