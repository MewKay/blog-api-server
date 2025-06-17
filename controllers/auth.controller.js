const passport = require("passport");
const jwt = require("jsonwebtoken");
const prisma = require("../config/prisma-client");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const logInUser = (req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      return next(error);
    }

    if (!user) {
      return res.status(401).json({
        error: info?.message || "Invalid username or password",
      });
    }

    const jwtOptions = {
      subject: user.id.toString(),
      expiresIn: "7d",
      algorithm: "HS256",
    };
    const token = jwt.sign(user, process.env.JWT_SECRET, jwtOptions);

    res.json({ user, token });
  })(req, res, next);
};

const signUpUser = async (req, res) => {
  const { username, password } = req.body;

  const encryptedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      username,
      password: encryptedPassword,
    },
  });
  delete newUser.password;

  res.json(newUser);
};

module.exports = { logInUser, signUpUser };
