# Thyblog - Server

Full-stack back end for the Thyblog site, providing a public reading API and a secure CMS for authors. Built with Express and PostgreSQL.

Default Authorization Pass : `wannabewriter`

**Links**:

- [Public Blog Site](https://github.com/MewKay/blog-api-client-user)
- [CMS](https://github.com/MewKay/blog-api-client-author)

## Features

- Authentication flows for users and authors (signup, login)
  - Guests can create limited guest accounts
  - Registered users can upgrade to author accounts with the authorization pass
- Public post discovery: list published posts and fetch a single published post
- Post management for authors: create, update, delete posts and manage publish status (drafts)
- Comment system: authenticated users can create and update their comments; authors can delete comments on their own posts
- URL-safe slugs for posts

## Motivations

- Provide a RESTful back end
- Stateless, token-based authentication using Passport.js JWT strategy and jsonwebtoken
- URL-friendly slugs via slugify
- Controlled CORS to allow the public site and CMS (different origins) to call the API securely
- Integration tests with Supertest and Vitest

## API Endpoints

#### Authentication and Account management

- `POST /api/login`
  - Purpose: Authenticate user and return JWT token
  - Auth: none
  - Body :

```json
{
 "username": string,
 "password": string
}
```

  - Response :

```json
{
 "user": {
  "id": number,
  "username": string,
  "is_author": boolean,
  "is_guest": boolean
 },
 "token": string
}
```

- `POST /api/auth/signup`
  - Purpose: Create and return newly created user
  - Auth: none
  - Body :

```json
{
 "username": string,
 "password": string,
 "confirm_password": string
}
```

  - Response:

```js
{
 "id": number,
 "username": string,
 "is_author": boolean,
 "is_guest": boolean
}
```

- `POST /api/signup-author`
  - Purpose: Create and return newly created user
  - Auth: none
  - Body:

```json
{
 "username": string,
 "password": string,
 "confirm_password": string,
 "author_password": string
}
```

  - Response:

```json
{
 "id": number,
 "username": string,
 "is_author": true,
 "is_guest": boolean
}
```

- `POST /api/guest-author`
  - Purpose: Create and return a guest account JWT token
  - Auth: none
  - Body: none
  - Response:

```json
{
 "user": {
  "id": number,
  "username": string,
  "is_author": true,
  "is_guest": true
 },
 "token": string
}
```

- `POST /api/auth/upgrade-user`
  - Purpose: Update user account to author account and return newly created author
  - Auth: Bearer - User token
  - Body:

```json
{
 "author_password": string
}
```

  - Response:

```json
{
 "id": number,
 "username": string,
 "is_author": true,
 "is_guest": boolean
}
```

#### Posts

- `GET /api/posts`
  - Purpose: List published posts
  - Auth: none
  - Response:

```json
[
  {
    "preview": string,
    "id": number,
    "title": string,
    "created_at": string,
    "edited_at": string,
    "is_published": true,
    "author_id": number,
    "author": {
      "username": string
    },
    "slug": string
  },
]
```

- `GET /api/posts/:postId`
  - Purpose: Return published post
  - Auth: none
  - Response:

```json
{
 "preview": string,
 "id": number,
 "title": string,
 "created_at": string,
 "edited_at": string,
 "is_published": true,
 "author_id": number,
 "author": {
  "username": string
  },
 "slug": string
}
```

- `POST /api/posts`
  - Purpose: Create and return newly created post
  - Auth: Bearer, Author token
  - Body:

```json
{
 "title": string,
 "text": string,
 "is_published": boolean
}
```

  - Response:

```json
{
 "id": number,
 "title": string,
 "text": string,
 "created_at": string,
 "edited_at": string,
 "is_published": boolean,
 "author_id": number,
 "slug": string
}
```

- `PUT /api/posts/:postId`
  - Purpose: Update and return updated post
  - Auth: Bearer, Author token
  - Body:

```json
{
 "title": string,
 "text": string,
 "is_published": boolean
}
```

  - Response:

```json
{
 "id": number,
 "title": string,
 "text": string,
 "created_at": string,
 "edited_at": string,
 "is_published": boolean,
 "author_id": number,
 "slug": string
}
```

- `DELETE /api/posts/:postId`
  - Purpose: Delete and return deleted post
  - Auth: Bearer, Author token
  - Response:

```json
{
 "id": number,
 "title": string,
 "text": string,
 "created_at": string,
 "edited_at": string,
 "is_published": boolean,
 "author_id": number,
 "slug": string
}
```

#### Authors

- `GET /api/authors/:authorId`
  - Purpose: Return id and username
  - Auth: Bearer, User token
  - Response:

```json
{
 "id": number,
 "username": string
}
```

- `GET /api/authors/:authorId/limit-status`
  - Purpose: Return author's post limit status (useful mostly for guests account)
  - Auth: Bearer, User token
  - Response:

```json
{
 "isLimitReached": boolean,
 "postRemaining": number
}
```

- `GET /api/authors/:authorId/posts`
  - Purpose: Return author's posts
  - Auth: Bearer, Author token
  - Response:

```json
[
 {
  "preview": string,
  "id": number,
  "title": string,
  "created_at": string,
  "edited_at": string,
  "is_published": boolean,
  "author_id": number,
  "slug": string
 }
]
```

- `GET /api/authors/:authorId/posts/:postId`
  - Purpose: Return author's post
  - Auth: Bearer, Author token
  - Response:

```json
{
 "id": number,
 "title": string,
 "text": string,
 "created_at": string,
 "edited_at": string,
 "is_published": boolean,
 "author_id": number,
 "slug": string
}
```

- `GET /api/posts/:postId/comments`
  - Purpose: Return post[id]'s comments
  - Auth: none
  - Response:

```json
[
  {
    "id": number,
    "text": string,
    "created_at": string,
    "edited_at": string,
    "user_id": number,
    "post_id": number,
    "user": {
      "username": string
    }
  }
]
```

- `POST /api/posts/:postId/comments`
  - Purpose: Create and return newly created comment
  - Auth: Bearer, User token
  - Body:

```json
{
 "text": string
}
```

  - Response:

```json
{
  "id": number,
  "text": string,
  "created_at": string,
  "edited_at": string,
  "user_id": number,
  "post_id": number
}
```

- `PUT /api/posts/:postId/comments/:commentId`
  - Purpose: Update and return newly updated comment
  - Auth: Bearer, User token
  - Body:

```json
{
 "text": string
}
```

  - Response:

```json
{
  "id": number,
  "text": string,
  "created_at": string,
  "edited_at": string,
  "user_id": number,
  "post_id": number
}
```

- `DELETE /api/posts/:postId/comments/:commentId`
  - Purpose: Delete and return deleted post
  - Auth: Bearer, Author token
  - Response:

```json
{
  "id": number,
  "text": string,
  "created_at": string,
  "edited_at": string,
  "user_id": number,
  "post_id": number
}
```

## To‑Do's

- Add pagination to post lists.
- Allow nested comments
- Browse posts by author's profile
