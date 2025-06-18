const { ExpressValidator } = require("express-validator");
const { ranges } = require("../../../constants/validation");

const { body } = new ExpressValidator();

const logInValidator = [
  body("username")
    .trim()
    .isLength(ranges.username)
    .withMessage(
      `Username is required to be between ${ranges.username.min} and ${ranges.username.max} characters.`,
    )
    .isAlphanumeric()
    .withMessage("Username can only contain letters and numbers."),
  body("password")
    .isLength(ranges.password)
    .withMessage(
      `Password must be between ${ranges.password.min} and ${ranges.password.max} characters.`,
    ),
];

module.exports = logInValidator;
