const passport = require("passport");
const prisma = require("../config/prisma-client");
const { matchedData } = require("express-validator");

const isAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (error, user) => {
    if (error) {
      return next(error);
    }

    if (!user) {
      return res.status(401).json({
        error: "Unauthorized request",
      });
    }

    req.user = user;
    next();
  })(req, res, next);
};

const isAuthor = (req, res, next) => {
  const { user } = req;

  if (!user.is_author) {
    return res.status(403).json({ error: "Forbidden request" });
  }

  next();
};

const isPostOfAuthor = async (req, res, next) => {
  const { user } = req;
  const { postId } = matchedData(req);

  const post = await prisma.post.findUnique({
    where: {
      id: postId,
      author_id: user.id,
    },
  });

  if (!post) {
    return res.status(403).json({ error: "Post not belonging to author" });
  }

  next();
};

const isCommentOfUser = async (req, res, next) => {
  const { user } = req;
  const { commentId } = matchedData(req);

  const comment = await prisma.comment.findUnique({
    where: {
      id: commentId,
      user_id: user.id,
    },
  });

  if (!comment) {
    return res.status(403).json({ error: "Comment not belonging to user" });
  }

  next();
};

module.exports = { isAuth, isAuthor, isPostOfAuthor, isCommentOfUser };
