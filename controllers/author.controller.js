const prisma = require("../config/prisma-client");
const { isAuthor } = require("../middlewares/auth");

const {
  idParam: idParamValidator,
} = require("../middlewares/validation/validators");
const validationHandler = require("../middlewares/validation/handler");
const { matchedData } = require("express-validator");

const getAuthorPosts = [
  isAuthor,
  idParamValidator("authorId"),
  validationHandler,
  async (req, res) => {
    const { authorId } = matchedData(req);

    const authorPosts = await prisma.post.findMany({
      where: {
        author_id: authorId,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    res.json(authorPosts);
  },
];

module.exports = { getAuthorPosts };
