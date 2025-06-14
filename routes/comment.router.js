const { Router } = require("express");

const router = Router({ mergeParams: true });

router.get("/", (req, res) => {
  res.send("This is comment route");
});

module.exports = router;
