const router = require("express").Router();
const { Challenge } = require("../db");

router.get("/", async (req, res, next) => {
  try {
    const allChallenges = await Challenge.findAll();
    // const sortedProjects = allProjects.sort((a, b) => a.id - b.id);
    res.send(allChallenges);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
