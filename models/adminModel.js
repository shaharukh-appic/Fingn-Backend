const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../app/config/sequelize");

const adminOnbording = sequelize.define("adminOnbording", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  email: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING },
  status: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = adminOnbording;
