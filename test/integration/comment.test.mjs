import { beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import app from "../../app";
import {
  authAuthor,
  authUser,
  getNotFoundPostId,
  seedComments,
  seedPosts,
} from "../utils/seeders";
import {
  assertAuth,
  assertInput,
  assertInvalidId,
  assertPermission,
  assertPostNotExist,
  assertPostNotPublished,
  assertResourcePossession,
} from "../utils/assertHelpers.mjs";
import { invalidLengthMessage, ranges } from "../../constants/validation";
import isDateSameSeconds from "../utils/isDateSameSeconds";

describe("Comments API", () => {
  let author;
  let anotherAuthor;
  let user;
  let post;
  let posts;
  let authorComment;
  let userComment;
  let notPublishedPost;
  let secondAuthorsPost;

  let notFoundPostId;
  const goodInput = {
    text: "This is good text",
  };
  const badInput = {
    text: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Error molestiae labore, beatae illum nemo iusto vel neque aperiam maiores voluptates quisquam, reiciendis esse odit assumenda aliquam quaerat nesciunt dignissimos et. Maxime nesciunt autem possimus ducimus mollitia quibusdam nostrum corrupti explicabo nemo veniam quaerat.",
  };

  beforeEach(async () => {
    author = await authAuthor();
    anotherAuthor = await authAuthor({
      username: "Crane",
      password: "ibelieveicanfly",
    });
    user = await authUser();

    posts = await seedPosts(author.id, anotherAuthor.id);
    post = posts[0];
    notPublishedPost = posts[1];
    secondAuthorsPost = posts[2];
    const comments = await seedComments(post.id, author.id, user.id);
    authorComment = comments[0];
    userComment = comments[1];
    notFoundPostId = getNotFoundPostId(posts);
  });

  describe("GET /posts/:postId/comments", () => {
    it("responds with list of comments from post", async () => {
      const response = await request(app)
        .get(`/api/posts/${post.id}/comments`)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: expect.any(Number),
            text: expect.any(String),
            created_at: expect.any(String),
            edited_at: expect.any(String),
            user_id: expect.any(Number),
            post_id: post.id,
          }),
        ]),
      );
    });

    it("responds with error message if id is not an integer", async () => {
      await assertInvalidId(request(app).get("/api/posts/abcd/comments"));
    });

    it("responds with not found error if post id does not exist", async () => {
      await assertPostNotExist(
        request(app).get(`/api/posts/${notFoundPostId}/comments`),
      );
    });
  });

  describe("POST /posts/:postId/comments", () => {
    it("responds with newly created comment with current date", async () => {
      const response = await request(app)
        .post(`/api/posts/${post.id}/comments`)
        .auth(user.token, { type: "bearer" })
        .send(goodInput)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toEqual(expect.objectContaining(goodInput));
      expect(
        isDateSameSeconds(new Date(), response.body.created_at),
      ).toBeTruthy();

      const responseGet = await request(app).get(
        `/api/posts/${post.id}/comments`,
      );

      expect(responseGet.body).toEqual(
        expect.arrayContaining([expect.objectContaining(goodInput)]),
      );
    });

    it("responds with auth error if invalid token", async () => {
      await assertAuth(request(app).post(`/api/posts/${post.id}/comments`));
    });

    it("responds with error message if id is not an integer", async () => {
      await assertInvalidId(request(app).post("/api/posts/abcd/comments"), {
        authToken: user.token,
      });
    });

    it("responds with validation error if invalid inputs", async () => {
      await assertInput(request(app).post(`/api/posts/${post.id}/comments`), {
        badInput,
        expectErrorMessagesArray: [
          invalidLengthMessage("Comment", ranges.commentText),
        ],
        authToken: user.token,
      });
    });

    it("responds with not found error if post id does not exist", async () => {
      await assertPostNotExist(
        request(app)
          .post(`/api/posts/${notFoundPostId}/comments`)
          .send(goodInput),
        {
          authToken: user.token,
        },
      );
    });

    it("responds with error message if post is not published", async () => {
      const notPublishedPost = posts[1];

      await assertPostNotPublished(
        request(app)
          .post(`/api/posts/${notPublishedPost.id}/comments`)
          .send(goodInput),
        {
          authToken: user.token,
        },
      );
    });
  });

  describe("PUT /posts/:postId/comments/:commentId", () => {
    it("responds with updated comment", async () => {
      const response = await request(app)
        .put(`/api/posts/${post.id}/comments/${userComment.id}`)
        .auth(user.token, { type: "bearer" })
        .send(goodInput)
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toEqual(expect.objectContaining(goodInput));
      expect(
        isDateSameSeconds(response.body.edited_at, new Date()),
      ).toBeTruthy();

      const responseGet = await request(app).get(
        `/api/posts/${post.id}/comments`,
      );

      expect(responseGet.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: userComment.id,
            ...goodInput,
          }),
        ]),
      );
    });

    it("responds with auth error if invalid token", async () => {
      await assertAuth(
        request(app).put(`/api/posts/${post.id}/comments/${userComment.id}`),
      );
    });

    it("responds with error message if id is not an integer", async () => {
      await assertInvalidId(
        request(app)
          .put(`/api/posts/abcd/comments/${userComment.id}`)
          .send(goodInput),
        {
          authToken: user.token,
        },
      );
      await assertInvalidId(
        request(app).put(`/api/posts/${post.id}/comments/abcd`).send(goodInput),
        {
          authToken: user.token,
        },
      );
    });

    it("responds with validation error if invalid inputs", async () => {
      await assertInput(
        request(app).put(`/api/posts/${post.id}/comments/${userComment.id}`),
        {
          badInput,
          expectErrorMessagesArray: [
            invalidLengthMessage("Comment", ranges.commentText),
          ],
          authToken: user.token,
        },
      );
    });

    it("responds with not found error if post id does not exist", async () => {
      await assertPostNotExist(
        request(app)
          .put(`/api/posts/${notFoundPostId}/comments/${userComment.id}`)
          .send(goodInput),
        {
          authToken: user.token,
        },
      );
    });

    it("responds with error message if post is not published", async () => {
      await assertPostNotPublished(
        request(app)
          .put(`/api/posts/${notPublishedPost.id}/comments/${userComment.id}`)
          .send(goodInput),
        {
          authToken: user.token,
        },
      );
    });

    it("responds with error message if comment is not created by user", async () => {
      await assertResourcePossession(
        request(app)
          .put(`/api/posts/${post.id}/comments/${authorComment.id}`)
          .send(goodInput),
        { authToken: user.token },
      );
    });
  });

  describe("DELETE /api/posts/:postId/comments/:commentId", () => {
    it("responds with deleted comment", async () => {
      const response = await request(app)
        .delete(`/api/posts/${post.id}/comments/${userComment.id}`)
        .auth(author.token, { type: "bearer" })
        .expect("Content-Type", /json/)
        .expect(200);

      expect(response.body).toEqual(expect.objectContaining(userComment));

      const responseGet = await request(app).get(
        `/api/posts/${post.id}/comments/`,
      );

      expect(responseGet.body).not.toContainEqual(
        expect.objectContaining(userComment),
      );
    });

    it("responds with auth error if invalid token", async () => {
      await assertAuth(
        request(app).delete(`/api/posts/${post.id}/comments/${userComment.id}`),
      );
    });

    it("responds with forbidden if auth user is not an author", async () => {
      await assertPermission(
        request(app).delete(`/api/posts/${post.id}/comments/${userComment.id}`),
      );
    });

    it("responds with error message if id is not an integer", async () => {
      await assertInvalidId(
        request(app).delete(`/api/posts/abcd/comments/${userComment.id}`),
        {
          authToken: author.token,
        },
      );
      await assertInvalidId(
        request(app).delete(`/api/posts/${post.id}/comments/abcd`),
        {
          authToken: author.token,
        },
      );
    });

    it("responds with error message if post is not found", async () => {
      await assertPostNotExist(
        request(app).delete(
          `/api/posts/${notFoundPostId}/comments/${userComment.id}`,
        ),
        { authToken: author.token },
      );
    });

    it("responds with error message if post is not created by auth author", async () => {
      await assertResourcePossession(
        request(app).delete(
          `/api/posts/${secondAuthorsPost.id}/comments/${userComment.id}`,
        ),
        { authToken: author.token },
      );
    });
  });
});
