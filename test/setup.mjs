import { beforeAll } from "vitest";
import prisma from "../config/prisma-client";

beforeAll(async () => {
  await prisma.$transaction([
    prisma.post.deleteMany(),
    prisma.post.deleteMany(),
    prisma.comment.deleteMany(),
  ]);
});
