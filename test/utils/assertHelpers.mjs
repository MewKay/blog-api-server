import { expect } from "vitest";
import request from "supertest";
import app from "../../app";

export const assertAuth = async (authRequest) => {
  const token = "notarealtoken";

  const response = await authRequest
    .auth(token, { type: "bearer" })
    .send({ Invalid: "Anyway" })
    .expect("Content-Type", /json/)
    .expect(401);

  expect(response.body.error).toMatch(/authentication/i);
};

export const assertPermission = async (permRequest) => {
  const userCredentials = {
    username: "JeanUser",
    password: "Michelle",
    confirm_password: "Michelle",
  };

  await request(app).post("/api/signup").send(userCredentials);
  const responseLogin = await request(app).post("/api/login").send({
    username: userCredentials.username,
    password: userCredentials.password,
  });

  const response = await permRequest
    .auth(responseLogin.body.token, { type: "bearer" })
    .send({ Invalid: "Anyway" })
    .expect("Content-Type", /json/)
    .expect(403);

  expect(response.body.error).toMatch(/permission/i);
};

export const assertInput = async (
  request,
  { badInput, expectErrorMessagesArray, authToken },
) => {
  const token = authToken || "";

  const response = await request
    .auth(token, { type: "bearer" })
    .send(badInput)
    .expect("Content-Type", /json/)
    .expect(400);

  expect(response.body.error).toEqual(
    expect.arrayContaining(expectErrorMessagesArray),
  );
};

export const assertInvalidId = async (request, { authToken } = {}) => {
  const token = authToken || "";

  const response = await request
    .auth(token, { type: "bearer" })
    .expect("Content-Type", /json/)
    .expect(400);

  expect(response.body.error).toEqual(
    expect.arrayContaining([expect.stringMatching(/Not an integer/i)]),
  );
};

export const assertPostNotOfAuthor = async (request, { authToken }) => {
  const token = authToken || "";

  const response = await request
    .auth(token, { type: "bearer" })
    .expect("Content-Type", /json/);

  expect(response.body.error).toMatch(/not belonging/i);
};
