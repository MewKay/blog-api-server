const router = require("express").Router();
const { post: controller } = require("../controllers");

router.get("/", controller.getAllPublishedPosts);
router.get("/:postId", controller.getPost);
router.post("/", controller.createPost);

module.exports = router;
