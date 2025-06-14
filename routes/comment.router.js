const { Router } = require("express");
const { comment: controller } = require("../controllers");

const router = Router({ mergeParams: true });

router.get("/", controller.getAllCommentsFromPost);
router.post("/", controller.createComment);

module.exports = router;
