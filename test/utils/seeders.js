const prisma = require("../../config/prisma-client");
const request = require("supertest");
const app = require("../../app");

const authAuthor = async (inputCredentials = {}) => {
  const defaultCredentials = {
    username: "TheAuthor",
    password: "protected",
    author_password: process.env.AUTHOR_PASSWORD,
  };
  const credentials = {
    ...defaultCredentials,
    ...inputCredentials,
  };
  credentials["confirm_password"] = credentials.password;

  await request(app).post("/api/signup-author").send(credentials);

  const response = await request(app).post("/api/login").send({
    username: credentials.username,
    password: credentials.password,
  });

  return {
    ...response.body.user,
    token: response.body.token,
  };
};

const authUser = async (inputCredentials = {}) => {
  const defaultCredentials = {
    username: "JeanUser",
    password: "Michelle",
    confirm_password: "Michelle",
  };
  const credentials = {
    ...defaultCredentials,
    ...inputCredentials,
  };

  await request(app).post("/api/signup").send(credentials);

  const response = await request(app).post("/api/login").send({
    username: credentials.username,
    password: credentials.password,
  });

  return {
    ...response.body.user,
    token: response.body.token,
  };
};

const seedPosts = async (firstAuthorId, secondAuthorId) => {
  const posts = (
    await prisma.post.createManyAndReturn({
      data: [
        {
          title: "This is a post",
          text: "Good post",
          is_published: true,
          author_id: firstAuthorId,
        },
        {
          title: "Secret post",
          text: "My precious",
          is_published: false,
          author_id: firstAuthorId,
        },
        {
          title: "Redundancy",
          text: "Hi, i am the second wheel",
          is_published: false,
          author_id: secondAuthorId,
        },
      ],
    })
  ).map((post) => ({
    ...post,
    created_at: post.created_at.toISOString(),
    edited_at: post.edited_at.toISOString(),
  }));

  return posts;
};

const seedComments = async (postId, authorId, userId) => {
  const comments = (
    await prisma.comment.createManyAndReturn({
      data: [
        {
          text: "This is my comment",
          post_id: postId,
          user_id: authorId,
        },
        {
          text: "Hello!",
          post_id: postId,
          user_id: userId,
        },
      ],
    })
  ).map((post) => ({
    ...post,
    created_at: post.created_at.toISOString(),
    edited_at: post.edited_at.toISOString(),
  }));

  return comments;
};

const getNotFoundPostId = (posts) => {
  return posts.reduce((previousId, currentValue) => {
    if (currentValue === previousId) {
      previousId++;
    }

    return previousId;
  }, 1);
};

module.exports = {
  authAuthor,
  authUser,
  seedPosts,
  seedComments,
  getNotFoundPostId,
};
