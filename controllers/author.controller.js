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

const getAuthor = [
  idParamValidator("authorId"),
  validationHandler,
  asyncHandler(async (req, res) => {
    const { authorId } = matchedData(req);

    const author = await prisma.user.findUnique({
      where: {
        id: authorId,
        is_author: true,
      },
    });

    if (!author) {
      throw new NotFound("Author not found");
    }

    res.json({
      id: author.id,
      username: author.username,
    });
  }),
];

const getLimitStatus = [
  idParamValidator("authorId"),
  validationHandler,
  asyncHandler(async (req, res) => {
    const { authorId } = matchedData(req);
    const limitStatus = {
      isLimitReached: false,
      postRemaining: null,
    };
    const guestPostLimit = 5;

    const guestAuthor = await prisma.user.findUnique({
      where: {
        id: authorId,
      },
    });

    if (!guestAuthor) {
      throw new NotFound("Author not found");
    }

    if (!guestAuthor.is_guest) {
      return res.json(limitStatus);
    }

    const postCount = await prisma.post.count({
      where: {
        author_id: guestAuthor.id,
      },
    });

    limitStatus.isLimitReached = postCount >= guestPostLimit;
    limitStatus.postRemaining = guestPostLimit - postCount;

    res.json(limitStatus);
  }),
];

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

module.exports = { getAuthor, getLimitStatus, getAuthorPosts, getAuthorPost };
