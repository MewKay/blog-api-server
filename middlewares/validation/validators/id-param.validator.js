const { param } = require("express-validator");

const idParamValidator = (paramFieldname) =>
  param(paramFieldname)
    .isInt()
    .withMessage(`Invalid ${paramFieldname} type : Not an Integer.`)
    .bail()
    .toInt();

module.exports = idParamValidator;
