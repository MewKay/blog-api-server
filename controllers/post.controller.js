const prisma = require("../config/prisma-client");

const getAllPublishedPosts = async (req, res) => {
  const posts = await prisma.post.findMany({
    where: {
      is_published: true,
    },
    include: {
      author: {
        select: {
          username: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  });

  res.json(posts);
};

const getPost = async (req, res) => {
  const postId = Number(req.params.postId);

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    include: {
      author: {
        select: {
          username: true,
        },
      },
    },
  });

  res.json(post);
};

const createPost = async (req, res) => {
  const { userId, ...postData } = req.body.post;

  const newPost = await prisma.post.create({
    data: {
      ...postData,
      author_id: userId,
    },
  });

  res.json(newPost);
};

module.exports = { getAllPublishedPosts, getPost, createPost };
