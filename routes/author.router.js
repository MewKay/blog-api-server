const router = require("express").Router();
const { author: controller } = require("../controllers");
const { isAuth } = require("../middlewares/auth");

router.use(isAuth);
router.get("/:authorId/posts", controller.getAuthorPosts);

module.exports = router;
