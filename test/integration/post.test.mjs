import { beforeEach, describe, expect, it, test } from "vitest";
import request from "supertest";
import app from "../../app";
import { authAuthor, getNotFoundPostId, seedPosts } from "../utils/seeders";
import { invalidLengthMessage, ranges } from "../../constants/validation";
import {
  assertAuth,
  assertPermission,
  assertInput,
  assertInvalidId,
  assertPostNotPublished,
  assertPostNotExist,
  assertResourcePossession,
} from "../utils/assertHelpers.mjs";

describe("Posts API", () => {
  let posts;
  let firstAuthor;
  let secondAuthor;
  let token;
  let notFoundPostId;
  let secondAuthorsPost;

  beforeEach(async () => {
    firstAuthor = await authAuthor();
    secondAuthor = await authAuthor({
      username: "Gilbert",
      password: "19341204",
    });

    token = firstAuthor.token;
    posts = await seedPosts(firstAuthor.id, secondAuthor.id);
    secondAuthorsPost = posts[2];

    notFoundPostId = getNotFoundPostId(posts);
  });

  test("GET /posts responds with list of published posts with preview and author username", async () => {
    const response = await request(app)
      .get("/api/posts")
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
          author: expect.objectContaining({ username: expect.any(String) }),
          is_published: true,
        }),
      ]),
    );
  });

  describe("GET /posts/:id", () => {
    it("responds with post with author username", async () => {
      const postToQuery = {
        ...posts[0],
      };

      const response = await request(app)
        .get(`/api/posts/${postToQuery.id}`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toEqual(
        expect.objectContaining({
          ...postToQuery,
          author: expect.objectContaining({ username: expect.any(String) }),
        }),
      );
    });

    it("responds with error message if id is not an integer", async () => {
      await assertInvalidId(request(app).get("/api/posts/abcd"));
    });

    it("responds with error message if post is not found", async () => {
      await assertPostNotExist(
        request(app).get(`/api/posts/${notFoundPostId}`),
      );
    });

    it("responds with error message if post is not published", async () => {
      const notPublishedPost = posts[1];

      await assertPostNotPublished(
        request(app).get(`/api/posts/${notPublishedPost.id}`),
      );
    });
  });

  describe("POST /posts", () => {
    it("stores new post", async () => {
      const newPost = {
        title: "New Post",
        text: "I am writing my thoughts",
        is_published: true,
      };

      const responseCreate = await request(app)
        .post(`/api/posts`)
        .auth(token, { type: "bearer" })
        .send(newPost)
        .expect("Content-Type", /json/)
        .expect(200);

      const responseGet = await request(app).get(
        `/api/posts/${responseCreate.body.id}`,
      );

      expect(responseGet.body).toEqual(expect.objectContaining(newPost));
    });

    it("responds with auth error if invalid token", async () => {
      await assertAuth(request(app).post("/api/posts"));
    });

    it("responds with forbidden error if auth user is not an author", async () => {
      await assertPermission(request(app).post("/api/posts"));
    });

    it("responds with validation error if invalid inputs", async () => {
      await assertInput(request(app).post("/api/posts"), {
        badInput: {
          title:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error molestiae labore, beatae illum nemo iusto vel neque aperiam maiores voluptates quisquam.",
          text: "",
          is_published: 10,
        },
        expectErrorMessagesArray: [
          invalidLengthMessage("Post title", ranges.postTitle),
          invalidLengthMessage("Post text", ranges.postText),
          expect.stringMatching(/Invalid publication/i),
        ],
        authToken: token,
      });
    });

    it("responds with error message if post is not found", async () => {
      await assertPostNotExist(
        request(app).get(`/api/posts/${notFoundPostId}`),
      );
    });
  });

  describe("PUT /posts/:id", () => {
    let toUpdatePost;
    const goodInput = {
      title: "I hope this post is mine...",
      text: "Finger crossed",
      is_published: true,
    };

    beforeEach(() => {
      toUpdatePost = posts[1];
    });

    it("responds with updated post", async () => {
      const response = await request(app)
        .put(`/api/posts/${toUpdatePost.id}`)
        .auth(token, { type: "bearer" })
        .send(goodInput)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toEqual(expect.objectContaining(goodInput));

      const responseGet = await request(app).get(
        `/api/posts/${toUpdatePost.id}`,
      );

      expect(responseGet.body).toEqual(
        expect.objectContaining(responseGet.body),
      );
    });

    it("responds with auth error if invalid token", async () => {
      await assertAuth(request(app).put(`/api/posts/${toUpdatePost.id}`));
    });

    it("responds with forbidden if auth user is not an author", async () => {
      await assertPermission(request(app).put(`/api/posts/${toUpdatePost.id}`));
    });

    it("responds with error message if post is not an integer", async () => {
      await assertInvalidId(request(app).put(`/api/posts/abcd`), {
        authToken: token,
      });
    });

    it("responds with validation error if invalid inputs", async () => {
      await assertInput(request(app).put(`/api/posts/${toUpdatePost}`), {
        badInput: {
          title:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error molestiae labore, beatae illum nemo iusto vel neque aperiam maiores voluptates quisquam.",
          text: "",
          is_published: 10,
        },
        expectErrorMessagesArray: [
          invalidLengthMessage("Post title", ranges.postTitle),
          invalidLengthMessage("Post text", ranges.postText),
          expect.stringMatching(/Invalid publication/i),
        ],
        authToken: token,
      });
    });

    it("responds with error message if post is not found", async () => {
      await assertPostNotExist(
        request(app).put(`/api/posts/${notFoundPostId}`).send(goodInput),
        {
          authToken: token,
        },
      );
    });

    it("responds with error message if post is not created by auth author", async () => {
      await assertResourcePossession(
        request(app).put(`/api/posts/${secondAuthorsPost.id}`).send(goodInput),
        { authToken: token },
      );
    });
  });

  describe("DELETE /posts/:id", () => {
    let toDeletePost;

    beforeEach(() => {
      toDeletePost = posts[1];
    });

    it("responds with deleted post", async () => {
      const response = await request(app)
        .delete(`/api/posts/${toDeletePost.id}`)
        .auth(token, { type: "bearer" })
        .expect("Content-Type", /json/)
        .expect(200);

      expect(toDeletePost).toEqual(expect.objectContaining(response.body));

      const responseGet = await request(app)
        .get(`/api/posts/${toDeletePost.id}`)
        .expect(404);

      expect(responseGet.body.error).toMatch(/not exist/i);
    });

    it("responds with auth error if invalid token", async () => {
      await assertAuth(request(app).delete(`/api/posts/${toDeletePost.id}`));
    });

    it("responds with forbidden if auth user is not an author", async () => {
      await assertPermission(
        request(app).delete(`/api/posts/${toDeletePost.id}`),
      );
    });

    it("responds with error message if post is not an integer", async () => {
      await assertInvalidId(request(app).delete(`/api/posts/abcd`), {
        authToken: token,
      });
    });

    it("responds with error message if post is not created by auth author", async () => {
      await assertResourcePossession(
        request(app).delete(`/api/posts/${secondAuthorsPost.id}`),
        { authToken: token },
      );
    });

    it("responds with error message if post is not found", async () => {
      await assertPostNotExist(
        request(app).delete(`/api/posts/${notFoundPostId}`),
        {
          authToken: token,
        },
      );
    });
  });
});
