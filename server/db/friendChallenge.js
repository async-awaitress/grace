const Sequelize = require("sequelize");
const db = require("./database");

const FriendChallenge = db.define("friendChallenge", {
  firstFriend_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  secondFriend_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  challenge_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  dailyStatusForFriend_1: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  dailyStatusForFriend_2: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  completionStatus: {
    type: Sequelize.ENUM("completed", "open", "failed"),
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

module.exports = FriendChallenge;
