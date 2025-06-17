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

module.exports = { isAuth };
