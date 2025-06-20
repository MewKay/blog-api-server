const prisma = require("../config/prisma-client");
const { isAuthor, isPostOfAuthor } = require("../middlewares/auth");

const {
  idParam: idParamValidator,
} = require("../middlewares/validation/validators");
const validationHandler = require("../middlewares/validation/handler");
const { matchedData } = require("express-validator");

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

const getPost = [
  idParamValidator("postId"),
  validationHandler,
  async (req, res) => {
    const { postId } = matchedData(req);

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
  },
];

const createPost = [
  isAuthor,
  async (req, res) => {
    const { user } = req;
    const post = req.body;

    const newPost = await prisma.post.create({
      data: {
        ...post,
        author_id: user.id,
      },
    });

    res.json(newPost);
  },
];

const updatePost = [
  isAuthor,
  idParamValidator("postId"),
  validationHandler,
  isPostOfAuthor,
  async (req, res) => {
    const { postId } = matchedData(req);
    const post = req.body;

    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        ...post,
        edited_at: new Date(),
      },
    });

    res.json(updatedPost);
  },
];

const deletePost = [
  isAuthor,
  idParamValidator("postId"),
  validationHandler,
  isPostOfAuthor,
  async (req, res) => {
    const { postId } = matchedData(req);

    const deletedPost = await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    res.json(deletedPost);
  },
];

module.exports = {
  getAllPublishedPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
};
