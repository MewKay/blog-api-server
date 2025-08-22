const { body } = require("express-validator");
const {
  ranges,
  invalidLengthMessage,
} = require("../../../constants/validation");

const postValidator = [
  body("title")
    .trim()
    .isLength(ranges.postTitle)
    .withMessage(invalidLengthMessage("Post title", ranges.postTitle)),
  body("text")
    .trim()
    .isLength(ranges.postText)
    .withMessage(invalidLengthMessage("Post text", ranges.postText)),
  body("is_published").isBoolean().withMessage("Invalid publication state"),
];

module.exports = postValidator;
