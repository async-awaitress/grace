const Sequelize = require("sequelize");
const db = require("./database");

// 4 days all status must be updated by EOD.. how do we find this?
// do we make this an array? [true, true, true, false] -> failed, array.length <= days of challenge && all vals are not true
// [true, true, true, true] -> complete, array.length === days of challenge && all true vals
//  [true, true, true] -> open, array.length < days of challenge && all true vals

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
