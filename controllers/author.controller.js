const prisma = require("../config/prisma-client");
const asyncHandler = require("express-async-handler");
const { isAuthor } = require("../middlewares/auth");

const {
  idParam: idParamValidator,
} = require("../middlewares/validation/validators");
const validationHandler = require("../middlewares/validation/handler");
const { matchedData } = require("express-validator");
const { Forbidden, NotFound } = require("../errors");
const { transformTextToPreview } = require("../utils/controller.util");

const getAuthorPosts = [
  isAuthor,
  idParamValidator("authorId"),
  validationHandler,
  asyncHandler(async (req, res) => {
    const { user } = req;
    const { authorId } = matchedData(req);

    if (authorId !== user.id) {
      throw new Forbidden("Not Author's posts");
    }

    const authorPosts = await prisma.post.findMany({
      where: {
        author_id: authorId,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (!authorPosts) {
      throw new NotFound("Author's posts could not be fetched");
    }

    const shortenedPosts = transformTextToPreview(authorPosts);
    res.json(shortenedPosts);
  }),
];

module.exports = { getAuthorPosts };
