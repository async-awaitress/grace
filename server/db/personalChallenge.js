const Sequelize = require("sequelize");
const db = require("./database");

const PersonalChallenge = db.define("personalChallenge", {
  // 4 days all status must be updated by EOD.. how do we find this?
  dailyStatus: {
    type: Sequelize.BOOLEAN, // do we make this an array? [true, true, true, false] -> failed, array.length <= days of challenge && all vals are not true
    defaultValue: false, // [true, true, true, true] -> complete, array.length === days of challenge && all true vals
  }, //  [true, true, true] -> open, array.length < days of challenge && all true vals
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
