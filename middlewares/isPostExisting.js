const asyncHandler = require("express-async-handler");
const prisma = require("../config/prisma-client");
const { matchedData } = require("express-validator");
const { NotFound } = require("../errors");

const isPostExisting = asyncHandler(async (req, res, next) => {
  const { postId } = matchedData(req);

  const post = await prisma.post.findUnique({ where: { id: postId } });

  if (!post) {
    throw new NotFound("Requested post does not exist.");
  }

  next();
});

module.exports = isPostExisting;
