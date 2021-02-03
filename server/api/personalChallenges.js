const router = require("express").Router();
const { Challenge, User, PersonalChallenge } = require("../db");

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

router.put("/updatePersonalChallenge/:challengeId", async (req, res, next) => {
  try {
    const personalChallenge = await PersonalChallenge.findOne({
      where: {
        challengeId: req.params.challengeId,
        userUid: req.body.uid,
      },
    });

    // update daily completion to true and add points for completion
    const challenge = await Challenge.findByPk(req.params.challengeId);
    await personalChallenge.update({
      dailyStatus: true,
      totalPointsEarned: challenge.pointsPerDay,
    });

    // update totalPoints of user for completed task per day
    const user = await User.findByPk("aaa");
    await user.update({
      totalPoints: user.totalPoints + challenge.pointsPerDay,
    });

    res.send(personalChallenge);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
