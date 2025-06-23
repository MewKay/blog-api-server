const { ExpressValidator } = require("express-validator");
const {
  ranges,
  invalidLengthMessage,
} = require("../../../constants/validation");
const prisma = require("../../../config/prisma-client");

const { Validation } = require("../../../errors");

const { body } = new ExpressValidator({
  isUsernameTaken: async (value) => {
    const user = await prisma.user.findUnique({
      where: {
        username: value,
      },
    });

    if (user) {
      throw new Validation("Username is already taken");
    }
  },
  isPasswordConfirmed: (value, { req }) => {
    return value === req.body.password;
  },
});

const signUpValidator = [
  body("username")
    .trim()
    .isLength(ranges.username)
    .withMessage(invalidLengthMessage("Username", ranges.username))
    .isAlphanumeric()
    .withMessage("Username can only contain letters and numbers.")
    .bail()
    .isUsernameTaken(),
  body("password")
    .isLength(ranges.password)
    .withMessage(invalidLengthMessage("Password", ranges.password)),
  body("confirm_password")
    .isLength(ranges.password)
    .withMessage(invalidLengthMessage("Password", ranges.password))
    .isPasswordConfirmed()
    .withMessage("Passwords are not matching"),
];

module.exports = signUpValidator;
