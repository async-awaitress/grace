const router = require("express").Router();
const cors = require("cors");

router.use(cors());
// "api/users/"
router.use("/users", require("./users"));
// "api/challenges"
router.use("/challenges", require("./challenges"));
// "api/personalChallenges"
router.use("/personalChallenges", require("./personalChallenges"));

router.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

module.exports = router;
