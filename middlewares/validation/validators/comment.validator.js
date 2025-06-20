const { body } = require("express-validator");
const {
  ranges,
  invalidLengthMessage,
} = require("../../../constants/validation");

const commentValidator = body("text")
  .trim()
  .isLength(ranges.commentText)
  .withMessage(invalidLengthMessage("Comment", ranges.commentText));

module.exports = commentValidator;
