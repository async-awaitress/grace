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
    default: false,
  },
  dailyStatusForFriend_2: {
    type: Sequelize.BOOLEAN,
    default: false,
  },
  completionStatus: {
    type: Sequelize.ENUM("completed, open, failed"),
    default: "open",
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

module.exports = FriendChallenge;
