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
  pointsPerDay: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  badge: {
    type: Sequelize.BLOB,
  },
  type: {
    type: Sequelize.ENUM("personal", "friend"),
  },
  description: {
    type: Sequelize.TEXT,
  },
});

module.exports = Challenge;
