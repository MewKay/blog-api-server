import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../app";
import bcrypt from "bcryptjs";
import prisma from "../../config/prisma-client";
import { invalidLengthMessage, ranges } from "../../constants/validation";
import jwt from "jsonwebtoken";
import assertMessages from "../utils/assertMessages";
import { assertInput } from "../utils/assertHelpers.mjs";

describe("Authentication API", () => {
  describe("POST /login", () => {
    const goodInput = {
      username: "Jonny10",
      password: "wordpass",
    };
    const badInput = {
      username: "Jonny15",
      password: "wrongpassword",
    };

    beforeEach(async () => {
      await prisma.user.create({
        data: {
          username: goodInput.username,
          password: bcrypt.hashSync(goodInput.password),
        },
      });
    });

    it("responds with user and token", async () => {
      const response = await request(app)
        .post("/api/login")
        .send(goodInput)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body.user).toEqual(
        expect.objectContaining({
          username: goodInput.username,
        }),
      );
      expect(
        jwt.verify(response.body.token, process.env.JWT_SECRET),
      ).toBeTruthy();
    });

    it(assertMessages.input, async () => {
      await assertInput(request(app).post("/api/login"), {
        badInput: { username: "<InvalidUsername>", password: "no" },
        expectErrorMessagesArray: [
          invalidLengthMessage("Username", ranges.username),
          invalidLengthMessage("Password", ranges.password),
          "Username can only contain letters and numbers.",
        ],
      });
    });

    describe("Auth error", () => {
      it("responds with error if username is not found", async () => {
        const response = await request(app)
          .post("/api/login")
          .send(badInput)
          .expect("Content-Type", /json/)
          .expect(401);
        expect(response.body.error).toEqual("User not found");
      });

      it("responds with error if password is invalid", async () => {
        const response = await request(app)
          .post("/api/login")
          .send({
            username: goodInput.username,
            password: badInput.password,
          })
          .expect("Content-Type", /json/)
          .expect(401);
        expect(response.body.error).toEqual("Password is invalid");
      });
    });
  });

  describe("POST /signup", () => {
    const goodInput = {
      username: "Jonny20",
      password: "wardposs",
      confirm_password: "wardposs",
    };
    const badInput = {
      username: "Jonnay19",
      password: "similar",
      confirm_password: "actually no",
    };

    beforeEach(async () => {
      await prisma.user.create({
        data: {
          username: badInput.username,
          password: bcrypt.hashSync(goodInput.password),
        },
      });
    });

    it("responds with new user", async () => {
      const response = await request(app)
        .post("/api/signup")
        .send(goodInput)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          username: goodInput.username,
          is_author: expect.any(Boolean),
        }),
      );
    });

    it("stores user to be logged in", async () => {
      const loginInput = {
        username: "Jonny75",
        password: "password",
      };
      const signUpInput = {
        ...loginInput,
        confirm_password: loginInput.password,
      };

      await request(app)
        .post("/api/signup")
        .send(signUpInput)
        .expect("Content-Type", /json/)
        .expect(200);

      await request(app)
        .post("/api/login")
        .send(loginInput)
        .expect("Content-Type", /json/)
        .expect(200);
    });

    describe("Validation error", () => {
      it("responds with error if username is already taken", async () => {
        const response = await request(app)
          .post("/api/signup")
          .send(badInput)
          .expect("Content-Type", /json/)
          .expect(400);

        expect(response.body.error).toEqual(
          expect.arrayContaining([
            "Username is already taken",
            "Passwords are not matching",
          ]),
        );
      });

      it(assertMessages.input, async () => {
        await assertInput(request(app).post("/api/signup"), {
          badInput: {
            username: "<Absolutely invalid username>",
            password: "mypassisthis",
            confirm_password: "no",
          },
          expectErrorMessagesArray: [
            invalidLengthMessage("Username", ranges.username),
            invalidLengthMessage("Password", ranges.password),
          ],
        });
      });
    });
  });

  describe("POST /signup-author", () => {
    const goodInput = {
      username: "Jonny21",
      password: "wardposs",
      confirm_password: "wardposs",
      author_password: process.env.AUTHOR_PASSWORD,
    };
    const badInput = {
      username: "Jonnay19",
      password: "similars",
      confirm_password: "actually no",
      author_password: "notanauthor",
    };

    it("responds with new author", async () => {
      const response = await request(app)
        .post("/api/signup-author")
        .send(goodInput)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          id: expect.any(Number),
          username: goodInput.username,
          is_author: true,
        }),
      );
    });

    it("stores user to be logged in", async () => {
      const loginInput = {
        username: goodInput.username,
        password: goodInput.password,
      };

      await request(app)
        .post("/api/signup-author")
        .send(goodInput)
        .expect("Content-Type", /json/)
        .expect(200);

      await request(app)
        .post("/api/login")
        .send(loginInput)
        .expect("Content-Type", /json/)
        .expect(200);
    });

    describe("Validation error", () => {
      beforeEach(async () => {
        await prisma.user.create({
          data: {
            username: badInput.username,
            password: bcrypt.hashSync(goodInput.password),
            is_author: true,
          },
        });
      });

      it("responds with error if username is already taken", async () => {
        const response = await request(app)
          .post("/api/signup-author")
          .send(badInput)
          .expect("Content-Type", /json/)
          .expect(400);

        expect(response.body.error).toEqual(
          expect.arrayContaining([
            "Username is already taken",
            "Passwords are not matching",
          ]),
        );
      });

      it(assertMessages.input, async () => {
        await assertInput(request(app).post("/api/signup-author"), {
          badInput: {
            username: "<Absolutely invalid username>",
            password: "mypassisthis",
            confirm_password: "no",
          },
          expectErrorMessagesArray: [
            invalidLengthMessage("Username", ranges.username),
            invalidLengthMessage("Password", ranges.password),
          ],
        });
      });

      it("responds with error if author pass is invalid", async () => {
        const response = await request(app)
          .post("/api/signup-author")
          .send({ ...goodInput, author_password: badInput.author_password })
          .expect("Content-Type", /json/)
          .expect(403);

        expect(response.body.error).toMatch(/invalid authorization pass/i);
      });
    });
  });
});
