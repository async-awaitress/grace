const db = require("./database");
const User = require("./user");
const Challenge = require("./challenge");
const PersonalChallenge = require("./personalChallenge");
const FriendChallenge = require("./friendChallenge");
const Friend = require("./friend");

// associations
User.belongsToMany(Challenge, { through: PersonalChallenge });
Challenge.belongsToMany(User, { through: PersonalChallenge });

User.belongsToMany(User, {
  as: "friends",
  through: Friend,
  foreignKey: "senderId",
  otherId: "receiverId",
});

module.exports = {
  db,
  User,
  Challenge,
  PersonalChallenge,
  FriendChallenge,
  Friend,
};
