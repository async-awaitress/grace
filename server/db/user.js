const Sequelize = require("sequelize");
const db = require("./database");

const User = db.define("user", {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  uid: {
    type: Sequelize.STRING,
    primaryKey: true,
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
  },
  totalPoints: {
    type: Sequelize.INTEGER,
  },
});

module.exports = User;
