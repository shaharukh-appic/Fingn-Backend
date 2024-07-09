const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../app/config/sequelize");

const lenderOnbording = sequelize.define("lenderonbording", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  firstName: { type: DataTypes.STRING },
  lastName: { type: DataTypes.STRING },
  professionalEmail: { type: DataTypes.STRING },
  lendingOrganiztion: { type: DataTypes.STRING },
  mobileNumber: { type: DataTypes.BIGINT },
  date: { type: DataTypes.DATE },
  lendingExperience: { type: DataTypes.STRING },
  product: { type: DataTypes.STRING },
  referralCode: { type: DataTypes.STRING },
  adminStatus: { type: DataTypes.BOOLEAN, defaultValue: true },
  city: { type: DataTypes.STRING },
  state: { type: DataTypes.STRING },
  recoveryEmail: { type: DataTypes.STRING },
  status: { type: DataTypes.BOOLEAN, defaultValue: false },
  emailOtp: { type: DataTypes.INTEGER, defaultValue: 123456 },
  recoveryEmailOtp: { type: DataTypes.INTEGER, defaultValue: 123456 },

  // Add a new field for update verification status
  updateVerificationStatus: {
    type: DataTypes.ENUM("pending", "verified", "rejected"),
    defaultValue: "pending", // You can change this default value as needed
  },
  // Additional fields...
  professionalEmail: { type: DataTypes.STRING },
  lendingOrganiztion: { type: DataTypes.STRING },
  mobileNumber: { type: DataTypes.BIGINT },
  lendingExperience: { type: DataTypes.STRING },
  yourProduct: { type: DataTypes.STRING },
  employeeCode: { type: DataTypes.STRING },
  yourDesignation: { type: DataTypes.STRING },
  reportingManager: { type: DataTypes.STRING },
  repoManDesignation: { type: DataTypes.STRING },
  visitingCard: { type: DataTypes.STRING },
  dateOfBirth: { type: DataTypes.STRING },
  city: { type: DataTypes.STRING },
  state: { type: DataTypes.STRING },
  personalEmail: { type: DataTypes.STRING },
  residentialAddress: { type: DataTypes.STRING },
  areMarried: { type: DataTypes.STRING },
  spouseName: { type: DataTypes.STRING },
  spouseDob: { type: DataTypes.STRING },
  marriageAnniversary: { type: DataTypes.STRING },
});

module.exports = lenderOnbording;
