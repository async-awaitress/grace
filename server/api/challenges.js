const router = require("express").Router();
const { Challenge, Item, User, PersonalChallenge } = require("../db");

router.get("/", async (req, res, next) => {
  try {
    const allChallenges = await Challenge.findAll();
    // const sortedProjects = allProjects.sort((a, b) => a.id - b.id);
    res.send(allChallenges);
  } catch (error) {
    next(error);
  }
});

router.post("/add/:challengeId", async (req, res, next) => {
  try {
    const player = await User.findByPk(req.user.id);
    const challenge = await Challenge.findOne(req.params.id);
    const addedChallenge = await player.addChallenge(challenge);
    res.send(addedChallenge);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
