const router = require("express").Router();
const { author: controller } = require("../controllers");

router.post("/", controller.createAuthor);
router.get("/:authorId/posts", controller.getAuthorPosts);

module.exports = router;
