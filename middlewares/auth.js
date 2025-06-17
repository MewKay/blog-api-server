const passport = require("passport");

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

module.exports = { isAuth, isAuthor };
