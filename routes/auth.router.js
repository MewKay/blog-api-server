const router = require("express").Router();
const { auth: controller } = require("../controllers");

router.post("/login", controller.logInUser);
router.post("/signup", controller.signUpUser);
router.post("/signup-author", controller.signUpAuthor);
router.post("/guest-author", controller.createGuestAuthor);
router.post("/upgrade-user", controller.upgradeUser);

module.exports = router;
