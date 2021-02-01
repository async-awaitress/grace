const router = require("express").Router();
const { Challenge, User } = require("../db");

router.post("/add/:challengeId", async (req, res, next) => {
  try {
    const user = await User.findByPk(req.body.uid);
    const challenge = await Challenge.findByPk(req.params.challengeId);
    // calculate duration * points per day and add the total value to personalChallengeTable
    const totalPointsToWin = challenge.duration * challenge.pointsPerDay;
    const personalChallenge = await user.addChallenges(challenge, {
      through: { totalPointsToWin },
    });
    res.send(personalChallenge);
  } catch (error) {
    next(error);
  }
});

module.exports = router;