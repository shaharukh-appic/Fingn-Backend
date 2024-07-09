const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../app/config/sequelize");

const user = sequelize.define("user", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  firstName: { type: DataTypes.STRING },
  lastName: { type: DataTypes.STRING },
  companyName: { type: DataTypes.STRING },
  jobTitle: { type: DataTypes.STRING },
  ExperienceInLendingIndustry: { type: DataTypes.STRING },
  isverified: { type: DataTypes.BOOLEAN, defaultValue: false },
  email: { type: DataTypes.STRING },
  other: { type: DataTypes.STRING },
  password: { type: DataTypes.STRING },
  emailOtp: { type: DataTypes.INTEGER, defaultValue: 123456 },
  mobileNo: { type: DataTypes.BIGINT },
  natureOfCompany: { type: DataTypes.STRING },
  status: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = user;
