const prisma = require("../config/prisma-client");
const {
  isAuthor,
  isPostOfAuthor,
  isCommentOfUser,
} = require("../middlewares/auth");

const getAllCommentsFromPost = async (req, res) => {
  const postId = Number(req.params.postId);

  const comments = await prisma.comment.findMany({
    where: {
      post_id: postId,
    },
  });

  res.json(comments);
};

const createComment = async (req, res) => {
  const postId = Number(req.params.postId);
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
};

const updateComment = [
  isCommentOfUser,
  async (req, res) => {
    const commentId = Number(req.params.commentId);
    const postId = Number(req.params.postId);
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
  isPostOfAuthor,
  async (req, res) => {
    const commentId = Number(req.params.commentId);

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
