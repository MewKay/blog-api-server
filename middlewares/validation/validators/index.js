const login = require("./login.validator");
const signup = require("./signup.validator");
const comment = require("./comment.validator");
const idParam = require("./id-param.validator");

module.exports = {
  login,
  signup,
  comment,
  idParam,
};
