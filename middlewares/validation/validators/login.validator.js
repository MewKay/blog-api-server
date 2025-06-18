const { ExpressValidator } = require("express-validator");

const { body } = new ExpressValidator();

const logInValidator = [
  body("username")
    .trim()
    .isLength({ min: 4, max: 15 })
    .withMessage(
      `Username is required to be between ${4} and ${15} characters.`,
    )
    .isAlphanumeric()
    .withMessage("Username can only contain letters and numbers."),
  body("password")
    .isLength({ min: 8, max: 255 })
    .withMessage(`Password must be between ${8} and ${255} characters.`),
];

module.exports = logInValidator;
