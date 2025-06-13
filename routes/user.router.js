const router = require("express").Router();
const { user: controller } = require("../controllers");

router.post("/", controller.createUser);

module.exports = router;
