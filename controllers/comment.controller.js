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

module.exports = { getAllCommentsFromPost };
