const router = require("express").Router();
const { post: controller } = require("../controllers");
const { isAuth } = require("../middlewares/auth");

const commentRouter = require("./comment.router");
router.use("/:postId/comments", commentRouter);

router.get("/", controller.getAllPublishedPosts);
router.get("/:postId", controller.getPost);

router.use(isAuth);
router.post("/", controller.createPost);
router.put("/:postId", controller.updatePost);
router.delete("/:postId", controller.deletePost);

module.exports = router;
