const request = require("supertest");
const app = require("../../app");

const authAuthor = async (inputCredentials = {}) => {
  const defaultCredentials = {
    username: "TheAuthor",
    password: "protected",
    confirm_password: "protected",
    author_password: process.env.AUTHOR_PASSWORD,
  };
  const credentials = {
    ...defaultCredentials,
    ...inputCredentials,
  };

  await request(app).post("/api/signup-author").send(credentials);

  const response = await request(app).post("/api/login").send({
    username: credentials.username,
    password: credentials.password,
  });

  return {
    author: response.body.user,
    token: response.body.token,
  };
};

module.exports = authAuthor;
