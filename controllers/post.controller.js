const prisma = require("../config/prisma-client");
const { isAuthor, isPostOfAuthor } = require("../middlewares/auth");

const {
  idParam: idParamValidator,
  post: postValidator,
} = require("../middlewares/validation/validators");
const validationHandler = require("../middlewares/validation/handler");
const { matchedData } = require("express-validator");

const asyncHandler = require("express-async-handler");
const { NotFound } = require("../errors");
const { transformTextToPreview } = require("../utils/controller.util");

const getAllPublishedPosts = asyncHandler(async (req, res) => {
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

  if (!posts) {
    throw new NotFound("Posts could not be fetched");
  }

  const shortenedPosts = transformTextToPreview(posts);

  res.json(shortenedPosts);
});

const getPost = [
  idParamValidator("postId"),
  validationHandler,
  asyncHandler(async (req, res) => {
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

    if (!post) {
      throw new NotFound("Request post does not exist.");
    }

    res.json(post);
  }),
];

const createPost = [
  isAuthor,
  postValidator,
  validationHandler,
  asyncHandler(async (req, res) => {
    const { user } = req;
    const { title, text } = matchedData(req);

    const newPost = await prisma.post.create({
      data: {
        title,
        text,
        author_id: user.id,
      },
    });

    res.json(newPost);
  }),
];

const updatePost = [
  isAuthor,
  idParamValidator("postId"),
  postValidator,
  validationHandler,
  isPostOfAuthor,
  asyncHandler(async (req, res) => {
    const { postId, title, text } = matchedData(req);

    const updatedPost = await prisma.post.update({
      where: {
        id: postId,
      },
      data: {
        title,
        text,
        edited_at: new Date(),
      },
    });

    res.json(updatedPost);
  }),
];

const deletePost = [
  isAuthor,
  idParamValidator("postId"),
  validationHandler,
  isPostOfAuthor,
  asyncHandler(async (req, res) => {
    const { postId } = matchedData(req);

    const deletedPost = await prisma.post.delete({
      where: {
        id: postId,
      },
    });

    res.json(deletedPost);
  }),
];

module.exports = {
  getAllPublishedPosts,
  getPost,
  createPost,
  updatePost,
  deletePost,
};
