const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../app/config/sequelize");

const dsaOnbording = sequelize.define("dsaonbording", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  email: { type: DataTypes.STRING },
  status: { type: DataTypes.BOOLEAN, defaultValue: false },
  mobileNumber: { type: DataTypes.BIGINT },
  mobileOtp: { type: DataTypes.INTEGER, defaultValue: 123456 },
  emailOtp: { type: DataTypes.INTEGER, defaultValue: 123456 },
  adminStatus: { type: DataTypes.BOOLEAN, defaultValue: true },
  referralCode: { type: DataTypes.STRING },
  fullName: { type: DataTypes.STRING },
  dateOfBirth: { type: DataTypes.DATE },
  expeFinanceIndus: { type: DataTypes.STRING },
  uploadpan: { type: DataTypes.STRING },
  aadharfront: { type: DataTypes.STRING },
  aadharback: { type: DataTypes.STRING },
});

module.exports = dsaOnbording;
