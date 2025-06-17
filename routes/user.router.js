const router = require("express").Router();
const { user: controller } = require("../controllers");
const { isAuth } = require("../middlewares/auth");

router.use(isAuth);
router.post("/", controller.createUser);

module.exports = router;
