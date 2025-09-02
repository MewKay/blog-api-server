import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../app";
import { authAuthor, getNotFoundPostId, seedPosts } from "../utils/seeders";
import assertMessages from "../utils/assertMessages";
import {
  assertAuth,
  assertInvalidId,
  assertPermission,
  assertPostNotExist,
  assertResourcePossession,
} from "../utils/assertHelpers.mjs";

describe("Author API", () => {
  let author;
  let secondAuthor;

  let posts;
  let authorsPost;
  let secondAuthorsPost;
  let notFoundPostId;

  beforeEach(async () => {
    author = await authAuthor();
    secondAuthor = await authAuthor({
      username: "NotProta",
      password: "imjustannpc",
    });

    posts = await seedPosts(author.id, secondAuthor.id);
    authorsPost = posts[1];
    secondAuthorsPost = posts[2];
    notFoundPostId = getNotFoundPostId(posts);
  });

  describe("GET /authors/:authorId/posts", () => {
    it("responds with list of author's posts with preview", async () => {
      const response = await request(app)
        .get(`/api/authors/${author.id}/posts`)
        .auth(author.token, { type: "bearer" })
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            title: expect.any(String),
            preview: expect.any(String),
            created_at: expect.any(String),
            edited_at: expect.any(String),
            author_id: expect.any(Number),
            is_published: expect.any(Boolean),
          }),
        ]),
      );
    });

    it(assertMessages.auth, async () => {
      await assertAuth(request(app).get(`/api/authors/${author.id}/posts`));
    });

    it(assertMessages.permission, async () => {
      await assertPermission(
        request(app).get(`/api/authors/${author.id}/posts`),
      );
    });

    it(assertMessages.invalidId, async () => {
      await assertInvalidId(request(app).get(`/api/authors/abcd/posts`), {
        authToken: author.token,
      });
    });

    it(assertMessages.resourcePossession("posts", "auth author"), async () => {
      await assertResourcePossession(
        request(app).get(`/api/authors/${secondAuthor.id}/posts`),
        { authToken: author.token },
      );
    });
  });

  describe("GET /authors/:authorId/posts/:postId", () => {
    it("responds with post by the author", async () => {
      const response = await request(app)
        .get(`/api/authors/${author.id}/posts/${authorsPost.id}`)
        .auth(author.token, { type: "bearer" })
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({ ...authorsPost }),
      );

      const responseSecond = await request(app)
        .get(`/api/authors/${secondAuthor.id}/posts/${secondAuthorsPost.id}`)
        .auth(secondAuthor.token, { type: "bearer" })
        .expect("Content-Type", /json/)
        .expect(200);

      expect(responseSecond.body).toEqual(
        expect.objectContaining({ ...secondAuthorsPost }),
      );
    });

    it(assertMessages.auth, async () => {
      await assertAuth(
        request(app).get(`/api/authors/${author.id}/posts/${authorsPost.id}`),
      );
    });

    it(assertMessages.permission, async () => {
      await assertPermission(
        request(app).get(`/api/authors/${author.id}/posts/${authorsPost.id}`),
      );
    });

    it(assertMessages.invalidId, async () => {
      await assertInvalidId(
        request(app).get(`/api/authors/abcd/posts/${authorsPost.id}`),
        {
          authToken: author.token,
        },
      );

      await assertInvalidId(
        request(app).get(`/api/authors/${author.id}/posts/abcd`),
        {
          authToken: author.token,
        },
      );
    });

    it(assertMessages.resourcePossession("post", "auth author"), async () => {
      await assertResourcePossession(
        request(app).get(
          `/api/authors/${secondAuthor.id}/posts/${secondAuthorsPost.id}`,
        ),
        { authToken: author.token },
      );
    });

    it(assertMessages.postNotExist, async () => {
      await assertPostNotExist(
        request(app).get(`/api/authors/${author.id}/posts/${notFoundPostId}`),
        {
          authToken: author.token,
        },
      );
    });
  });
});
