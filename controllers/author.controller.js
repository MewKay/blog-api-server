const prisma = require("../config/prisma-client");
const bcrypt = require("bcryptjs");

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

const createAuthor = async (req, res) => {
  const { username, password } = req.body.author;

  const newAuthor = await prisma.user.create({
    data: {
      username,
      password: await bcrypt.hash(password, 10),
      is_author: true,
    },
  });
  delete newAuthor.password;

  res.json(newAuthor);
};

module.exports = { getAuthorPosts, createAuthor };
