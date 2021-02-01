const router = require("express").Router();
const { User } = require("../db");

router.get("/users", async (req, res, next) => {
  try {
    const allUsers = await User.findAll();
    // const sortedProjects = allProjects.sort((a, b) => a.id - b.id);
    res.send(allUsers);
  } catch (error) {
    next(error);
  }
});

module.exports = router;