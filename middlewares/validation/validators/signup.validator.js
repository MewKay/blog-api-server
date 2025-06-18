const { ExpressValidator } = require("express-validator");
const { ranges } = require("../../../constants/validation");
const prisma = require("../../../config/prisma-client");

const { body } = new ExpressValidator({
  isUsernameTaken: async (value) => {
    const user = await prisma.user.findUnique({
      where: {
        username: value,
      },
    });

    if (user) {
      throw new Error("Username is already taken");
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
    .withMessage(
      `Username is required to be between ${ranges.username.min} and ${ranges.username.max} characters.`,
    )
    .isAlphanumeric()
    .withMessage("Username can only contain letters and numbers.")
    .bail()
    .isUsernameTaken(),
  body("password")
    .isLength(ranges.password)
    .withMessage(
      `Password must be between ${ranges.password.min} and ${ranges.password.max} characters.`,
    ),
  body("confirm_password")
    .isLength(ranges.password)
    .withMessage(
      `Password must be between ${ranges.password.min} and ${ranges.password.max} characters.`,
    )
    .isPasswordConfirmed()
    .withMessage("Passwords are not matching"),
];

module.exports = signUpValidator;
