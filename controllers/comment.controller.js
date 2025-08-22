const prisma = require("../config/prisma-client");
const {
  isAuthor,
  isPostOfAuthor,
  isCommentOfUser,
  isPostPublished,
} = require("../middlewares/auth");

const {
  idParam: idParamValidator,
  comment: commentValidator,
} = require("../middlewares/validation/validators");
const validationHandler = require("../middlewares/validation/handler");
const { matchedData } = require("express-validator");

const asyncHandler = require("express-async-handler");
const { NotFound } = require("../errors");

const getAllCommentsFromPost = [
  idParamValidator("postId"),
  validationHandler,
  asyncHandler(async (req, res) => {
    const { postId } = matchedData(req);

    const comments = await prisma.comment.findMany({
      where: {
        post_id: postId,
      },
      include: {
        user: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (!comments) {
      throw new NotFound("Comments could not be fetched");
    }

    res.json(comments);
  }),
];

const createComment = [
  idParamValidator("postId"),
  commentValidator,
  validationHandler,
  isPostPublished,
  asyncHandler(async (req, res) => {
    const { user } = req;
    const { postId, text } = matchedData(req);

    const comment = await prisma.comment.create({
      data: {
        text,
        user_id: user.id,
        post_id: postId,
      },
    });

    res.json(comment);
  }),
];

const updateComment = [
  idParamValidator("postId"),
  idParamValidator("commentId"),
  commentValidator,
  validationHandler,
  isPostPublished,
  isCommentOfUser,
  asyncHandler(async (req, res) => {
    const { postId, commentId, text } = matchedData(req);

    const comment = await prisma.comment.update({
      where: {
        id: commentId,
        post_id: postId,
      },
      data: {
        text,
        edited_at: new Date(),
      },
    });

    res.json(comment);
  }),
];

const deleteComment = [
  isAuthor,
  idParamValidator("postId"),
  idParamValidator("commentId"),
  validationHandler,
  isPostOfAuthor,
  asyncHandler(async (req, res) => {
    const { commentId } = matchedData(req);

    const comment = await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    res.json(comment);
  }),
];

module.exports = {
  getAllCommentsFromPost,
  createComment,
  updateComment,
  deleteComment,
};
