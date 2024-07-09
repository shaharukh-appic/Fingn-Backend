const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../app/config/sequelize");
const lenderModel = require("./lenderModel");

const updatedLenderProfile = sequelize.define("updatedLenderProfile", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },

  professionalEmail: {
    type: DataTypes.STRING,
  },
  lendingOrganiztion: {
    type: DataTypes.STRING,
  },
  mobileNumber: {
    type: DataTypes.BIGINT,
  },
  lendingExperience: {
    type: DataTypes.STRING,
  },
  yourProduct: {
    type: DataTypes.STRING,
  },
  employeeCode: {
    type: DataTypes.STRING,
  },
  yourDesignation: {
    type: DataTypes.STRING,
  },
  reportingManager: {
    type: DataTypes.STRING,
  },
  repoManDesignation: {
    type: DataTypes.STRING,
  },


  updateVerificationStatus: {
    type: DataTypes.ENUM("pending", "verified", "rejected"),
    defaultValue: "pending",
  },
});

// Define the association with lenderModel
updatedLenderProfile.belongsTo(lenderModel, { foreignKey: "lenderId" });

module.exports = updatedLenderProfile;
