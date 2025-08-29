import { beforeEach } from "vitest";
import prisma from "../config/prisma-client";

beforeEach(async () => {
  await prisma.$transaction([
    prisma.post.deleteMany(),
    prisma.user.deleteMany(),
    prisma.comment.deleteMany(),
  ]);
});
