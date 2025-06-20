const prisma = require("../config/prisma-client");
const {
  isAuthor,
  isPostOfAuthor,
  isCommentOfUser,
} = require("../middlewares/auth");

const {
  idParam: idParamValidator,
} = require("../middlewares/validation/validators");
const validationHandler = require("../middlewares/validation/handler");
const { matchedData } = require("express-validator");

const getAllCommentsFromPost = [
  idParamValidator("postId"),
  validationHandler,
  async (req, res) => {
    const { postId } = matchedData(req);

    const comments = await prisma.comment.findMany({
      where: {
        post_id: postId,
      },
    });

    res.json(comments);
  },
];

const createComment = [
  idParamValidator("postId"),
  validationHandler,
  async (req, res) => {
    const { postId } = matchedData(req);
    const { user } = req;
    const { text } = req.body;

    const comment = await prisma.comment.create({
      data: {
        text,
        user_id: user.id,
        post_id: postId,
      },
    });

    res.json(comment);
  },
];

const updateComment = [
  idParamValidator("postId"),
  idParamValidator("commentId"),
  validationHandler,
  isCommentOfUser,
  async (req, res) => {
    const { postId, commentId } = matchedData(req);
    const { text } = req.body;

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
  },
];

const deleteComment = [
  isAuthor,
  idParamValidator("postId"),
  idParamValidator("commentId"),
  validationHandler,
  isPostOfAuthor,
  async (req, res) => {
    const { commentId } = matchedData(req);

    const comment = await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    res.json(comment);
  },
];

module.exports = {
  getAllCommentsFromPost,
  createComment,
  updateComment,
  deleteComment,
};
