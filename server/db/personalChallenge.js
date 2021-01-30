const Sequelize = require("sequelize");
const db = require("./database");

const PersonalChallenge = db.define("personalChallenge", {
  dailyStatus: {
    type: Sequelize.BOOLEAN,
    default: false,
  },
  completionStatus: {
    type: Sequelize.ENUM("open", "completed", "failed"),
    deafult: "open",
  },
  totalPointsEarned: {
    type: Sequelize.INTEGER,
    default: 0,
  },
  totalPointsToWin: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = PersonalChallenge;
