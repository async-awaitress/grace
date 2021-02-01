const Sequelize = require("sequelize");
const db = require("./database");

const PersonalChallenge = db.define("personalChallenge", {
  dailyStatus: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  completionStatus: {
    type: Sequelize.ENUM("open", "completed", "failed"),
    defaultValue: "open",
  },
  totalPointsEarned: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
  totalPointsToWin: {
    type: Sequelize.INTEGER,
    defaultValue: 0,
  },
});

module.exports = PersonalChallenge;
