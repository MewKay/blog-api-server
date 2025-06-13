const router = require("express").Router();
const { author: controller } = require("../controllers");

router.get("/:authorId/posts", controller.getAuthorPosts);

module.exports = router;
