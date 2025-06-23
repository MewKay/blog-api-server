const { NotFound: NotFoundError } = require("../errors");

// eslint-disable-next-line no-unused-vars
const notFoundRoute = (req, res, next) => {
  throw new NotFoundError("Route not found");
};

module.exports = notFoundRoute;
