const router = require("express").Router();
const { post: controller } = require("../controllers");

router.get("/", controller.getAllPublishedPosts);
router.get("/:postId", controller.getPost);
router.post("/", controller.createPost);
router.put("/:postId", controller.updatePost);
router.delete("/:postId", controller.deletePost);

const commentRouter = require("./comment.router");
router.use("/:postId/comments", commentRouter);

module.exports = router;
