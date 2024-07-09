const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../app/config/sequelize");

const contactus = sequelize.define("contactus", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  firstName: { type: DataTypes.STRING },
  lastName: { type: DataTypes.STRING },
  companyName: { type: DataTypes.STRING },
  jobTitle: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  mobileNo: { type: DataTypes.BIGINT },
  natureOfBusiness: { type: DataTypes.STRING },
  ExperienceInLendingIndustry: { type: DataTypes.STRING },
  yourQuery: { type: DataTypes.STRING },
  other: { type: DataTypes.STRING },
  status: { type: DataTypes.BOOLEAN, defaultValue: true },
});

module.exports = contactus;
