const router = require("express").Router();

router.get("/", (req, res) => {
  res.send("This is author route");
});

module.exports = router;
