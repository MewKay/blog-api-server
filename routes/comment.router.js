const { Router } = require("express");
const { comment: controller } = require("../controllers");

const router = Router({ mergeParams: true });

router.get("/", controller.getAllCommentsFromPost);

module.exports = router;
