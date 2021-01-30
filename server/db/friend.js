const Sequelize = require("sequelize");
const db = require("./database");

const Friend = db.define("friend", {
  statusOfFriendship: {
    type: Sequelize.ENUM("pending", "accepted"),
    allowNull: false,
  },
});

module.exports = Friend;