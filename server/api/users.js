const router = require("express").Router();
const { User } = require("../db");

router.get("/", async (req, res, next) => {
  try {
    const allUsers = await User.findAll();
    // const sortedProjects = allProjects.sort((a, b) => a.id - b.id);
    res.send(allUsers);
  } catch (error) {
    next(error);
  }
});

router.get("/:email", async (req, res, next) => {
  try {
    const user = await User.findOne({where:{
      email: req.params.email
    }})
    res.send(user)
  } catch (error) {
    next(error)
  }
})
router.get("/:userId", async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { uid: req.params.userId } });
    res.send(user);
  } catch (error) {
    next(error);
  }
});


router.post("/", async (req, res, next) => {
  try {
    const newUser = await User.create(req.body)
    res.json(newUser)
  } catch (error) {
    next(error)
  }
})

module.exports = router;
