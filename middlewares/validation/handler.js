const { validationResult } = require("express-validator");

const validationHandler = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const errorsArray = errors.array();

  res.status(400).json(errorsArray);
};

module.exports = validationHandler;
