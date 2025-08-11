const { validationResult } = require("express-validator");

const validationHandler = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const errorsArray = errors.array().map((error) => error.msg);

  res.status(400).json({ error: errorsArray });
};

module.exports = validationHandler;
