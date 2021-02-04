const router = require("express").Router();
const { Challenge, User, PersonalChallenge } = require("../db");

router.get("/", async (req, res, next) => {
  try {
    const allChallenges = await Challenge.findAll();
    res.send(allChallenges);
  } catch (error) {
    next(error);
  }
});

router.get("/:userId", async (req, res, next) => {
  try {
    // request to find one user with uid and their assigned challenges of this user (through personalChallenges table)
    const allPersonalChallenges = await User.findOne({
      include: { model: Challenge },
      where: { uid: req.params.userId },
    });
    res.send(allPersonalChallenges.challenges);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
