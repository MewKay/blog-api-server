const assertMessages = {
  auth: "responds with auth error if invalid token",
  permission: "responds with forbidden error if auth user is not an author",
  input: "responds with validation error if invalid inputs",
  invalidId: "responds with error message if id is not an integer",
  resourcePossession: (protectedResource, role) =>
    `responds with error message if ${protectedResource} is not created by ${role}`,
  postNotPublished: "responds with error message if post is not published",
  postNotExist: "responds with error message if post is not found",
};

module.exports = assertMessages;
