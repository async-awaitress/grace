const router = require("express").Router();

// "api/users/"
// router.use("/users", require("../db/user"));
router.use("/users", require("./users"));
// "api/challenges"
router.use("/challenges", require("./challenges"));

router.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

module.exports = router;
