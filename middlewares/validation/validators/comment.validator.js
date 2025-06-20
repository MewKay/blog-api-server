const { body } = require("express-validator");
const { ranges } = require("../../../constants/validation");

const commentValidator = body("text")
  .trim()
  .isLength(ranges.commentText)
  .withMessage(
    `Comments should be between ${ranges.commentText.min} and ${ranges.commentText.max} characters.`,
  );

module.exports = commentValidator;
