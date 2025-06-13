const prisma = require("../config/prisma-client");

const getAuthorPosts = async (req, res) => {
  const authorId = Number(req.params.authorId);

  const authorPosts = await prisma.post.findMany({
    where: {
      author_id: authorId,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  res.json(authorPosts);
};

module.exports = { getAuthorPosts };
