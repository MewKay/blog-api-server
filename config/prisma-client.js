const { PrismaClient } = require("../generated/prisma");
const { default: slugify } = require("slugify");

const databaseUrl =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_DATABASE_URL
    : process.env.DATABASE_URL;

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
}).$extends({
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
