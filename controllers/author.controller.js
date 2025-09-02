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
      throw new Forbidden("Posts not belonging to author");
    }

    const authorPosts = await prisma.post.findMany({
      where: {
        author_id: authorId,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const shortenedPosts = transformTextToPreview(authorPosts);
    res.json(shortenedPosts);
  }),
];

const getAuthorPost = [
  isAuthor,
  idParamValidator("authorId"),
  idParamValidator("postId"),
  validationHandler,
  asyncHandler(async (req, res) => {
    const { user } = req;
    const { authorId, postId } = matchedData(req);

    if (authorId !== user.id) {
      throw new Forbidden("Post not belonging to author");
    }

    const authorPost = await prisma.post.findUnique({
      where: {
        id: postId,
        author_id: authorId,
      },
    });

    if (!authorPost) {
      throw new NotFound("Requested post does not exist.");
    }

    res.json(authorPost);
  }),
];

module.exports = { getAuthorPosts, getAuthorPost };
