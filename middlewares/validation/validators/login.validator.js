const { ExpressValidator } = require("express-validator");
const {
  ranges,
  invalidLengthMessage,
} = require("../../../constants/validation");

const { body } = new ExpressValidator();

const logInValidator = [
  body("username")
    .trim()
    .isLength(ranges.username)
    .withMessage(invalidLengthMessage("Username", ranges.username))
    .isAlphanumeric()
    .withMessage("Username can only contain letters and numbers."),
  body("password")
    .isLength(ranges.password)
    .withMessage(invalidLengthMessage("Password", ranges.password)),
];

module.exports = logInValidator;
