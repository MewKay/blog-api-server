// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "dev") {
    console.error(err);
  }

  res.status(statusCode).json({ error: err.message });
};

module.exports = errorHandler;
