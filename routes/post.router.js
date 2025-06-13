const router = require("express").Router();
const { post: controller } = require("../controllers");

router.get("/", controller.getAllPublishedPosts);
router.get("/:postId", controller.getPost);

module.exports = router;
