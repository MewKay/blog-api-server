const passport = require("passport");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma-client");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const {
  login: logInValidator,
  signup: signUpValidator,
} = require("../middlewares/validation/validators");
const validationHandler = require("../middlewares/validation/handler");
const { matchedData } = require("express-validator");

const asyncHandler = require("express-async-handler");
const { Unauthorized, Forbidden } = require("../errors");

const logInUser = [
  logInValidator,
  validationHandler,
  (req, res, next) => {
    passport.authenticate("local", (error, user, info) => {
      if (error) {
        return next(error);
      }

      if (!user) {
        return next(
          new Unauthorized(info?.message || "Invalid username or password"),
        );
      }

      const jwtOptions = {
        subject: user.id.toString(),
        expiresIn: "7d",
        algorithm: "HS256",
      };
      const token = jwt.sign(user, process.env.JWT_SECRET, jwtOptions);

      res.json({ user, token });
    })(req, res, next);
  },
];

const signUpUser = [
  signUpValidator,
  validationHandler,
  asyncHandler(async (req, res) => {
    const { username, password } = matchedData(req);

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username,
        password: encryptedPassword,
      },
    });
    delete newUser.password;

    res.json(newUser);
  }),
];

const signUpAuthor = [
  signUpValidator,
  validationHandler,
  asyncHandler(async (req, res) => {
    const { username, password } = matchedData(req);
    const { author_password } = req.body;

    if (author_password !== process.env.AUTHOR_PASSWORD) {
      throw new Forbidden(
        "Invalid Authorization Pass. Permission is required to create an author account",
      );
    }

    const encryptedPassword = await bcrypt.hash(password, 10);
    const newAuthor = await prisma.user.create({
      data: {
        username,
        password: encryptedPassword,
        is_author: true,
      },
    });
    delete newAuthor.password;

    res.json(newAuthor);
  }),
];

module.exports = { logInUser, signUpUser, signUpAuthor };
