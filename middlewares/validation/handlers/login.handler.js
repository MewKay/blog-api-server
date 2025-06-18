const { validationResult } = require("express-validator");

const logInValidationHandler = (req, res, next) => {
  const errors = validationResult(req);

  if (errors.isEmpty()) {
    return next();
  }

  const errorsArray = errors.array();

  res.status(400).json(errorsArray);
};

module.exports = logInValidationHandler;
