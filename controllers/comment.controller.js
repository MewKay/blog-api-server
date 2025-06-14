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

module.exports = { getAllCommentsFromPost, createComment };
