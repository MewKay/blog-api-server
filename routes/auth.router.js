const router = require("express").Router();
const { auth: controller } = require("../controllers");

router.post("/login", controller.logInUser);

module.exports = router;
