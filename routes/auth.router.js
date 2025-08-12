const router = require("express").Router();
const { auth: controller } = require("../controllers");

router.post("/login", controller.logInUser);
router.post("/signup", controller.signUpUser);
router.post("/signup-author", controller.signUpAuthor);

module.exports = router;
