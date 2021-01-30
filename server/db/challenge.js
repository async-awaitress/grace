const Sequelize = require("sequelize");
const db = require("./database");

const Challenge = db.define("challenge", {
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  category: {
    type: Sequelize.ENUM("water", "waste", "transportation"),
    allowNull: false,
  },
  duration: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  points: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = Challenge;
