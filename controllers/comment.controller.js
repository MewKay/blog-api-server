const prisma = require("../config/prisma-client");

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
  const { userId, text } = req.body.comment;

  const comment = await prisma.comment.create({
    data: {
      text,
      user_id: userId,
      post_id: postId,
    },
  });

  res.json(comment);
};

const updateComment = async (req, res) => {
  const commentId = Number(req.params.commentId);
  const { text } = req.body.comment;

  const comment = await prisma.comment.update({
    where: {
      id: commentId,
    },
    data: {
      text,
      edited_at: new Date(),
    },
  });

  res.json(comment);
};

module.exports = { getAllCommentsFromPost, createComment, updateComment };
