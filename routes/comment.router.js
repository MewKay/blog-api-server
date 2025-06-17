const { Router } = require("express");
const { comment: controller } = require("../controllers");
const { isAuth } = require("../middlewares/auth");

const router = Router({ mergeParams: true });

router.get("/", controller.getAllCommentsFromPost);

router.use(isAuth);
router.post("/", controller.createComment);
router.put("/:commentId", controller.updateComment);
router.delete("/:commentId", controller.deleteComment);

module.exports = router;
