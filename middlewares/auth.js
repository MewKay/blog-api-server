const passport = require("passport");
const prisma = require("../config/prisma-client");
const { matchedData } = require("express-validator");

const asyncHandler = require("express-async-handler");
const { Unauthorized, Forbidden } = require("../errors");

const isAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user) => {
    if (error) {
      return next(error);
    }

    if (!user) {
      return next(new Unauthorized("Request require authentication."));
    }

    req.user = user;
    next();
  })(req, res, next);
};

const isAuthor = (req, res, next) => {
  const { user } = req;

  if (!user.is_author) {
    return next(new Forbidden("Request require valid permissions"));
  }

  next();
};

const isPostOfAuthor = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const { postId } = matchedData(req);

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
      author_id: user.id,
    },
  });

  if (!post) {
    throw new Forbidden("Post not belonging to author");
  }

  next();
});

const isCommentOfUser = asyncHandler(async (req, res, next) => {
  const { user } = req;
  const { commentId } = matchedData(req);

  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
      user_id: user.id,
    },
  });

  if (!comment) {
    throw new Forbidden("Comment not belonging to user");
  }

  next();
});

const isPostPublished = asyncHandler(async (req, res, next) => {
  const { postId } = matchedData(req);

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
  });

  if (!post.is_published) {
    throw new Forbidden("Access to resource denied");
  }

  next();
});

module.exports = {
  isAuth,
  isAuthor,
  isPostOfAuthor,
  isCommentOfUser,
  isPostPublished,
};
