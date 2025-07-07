const { PrismaClient } = require("../generated/prisma");
const { default: slugify } = require("slugify");

const prisma = new PrismaClient().$extends({
  name: "titleSlug",
  result: {
    post: {
      slug: {
        needs: { title: true },
        compute(post) {
          return slugify(post.title, { lower: true, strict: true });
        },
      },
    },
  },
});

module.exports = prisma;
