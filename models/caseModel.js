const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("../app/config/sequelize");

const dsaOnbording = require("./dsaModel");

const lenderModel = require("./lenderModel");

const caseDetails = sequelize.define("casedetail", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  loanType: { type: DataTypes.STRING },
  flag: {
    type: DataTypes.ENUM("completeCasefile", "onlyLead"),
    defaultValue: "completeCasefile",
  },
  loanCategory: { type: DataTypes.STRING },
  lenderName: { type: DataTypes.STRING },
  loanAmount: { type: DataTypes.INTEGER },
  propertyValue: { type: DataTypes.INTEGER },
  propertyStatus: { type: DataTypes.STRING },
  propertyType: { type: DataTypes.STRING },
  propertyUses: { type: DataTypes.STRING },
  propertyOwnership: { type: DataTypes.STRING },
  propertyPincode: { type: DataTypes.STRING },
  nameOfKeyApplicant: { type: DataTypes.STRING },
  age: { type: DataTypes.INTEGER },
  residencePin: { type: DataTypes.STRING },
  residenceType: { type: DataTypes.STRING },
  occupiedDuration: { type: DataTypes.STRING },
  sourceIncome: { type: DataTypes.STRING },
  workingOrgType: { type: DataTypes.STRING },
  currentExperience: { type: DataTypes.STRING },
  totalExperience: { type: DataTypes.STRING },
  aboutClient: { type: DataTypes.STRING },
  monthlySalary: { type: DataTypes.INTEGER },
  monthlyEmi: { type: DataTypes.INTEGER },
  cibilScore: { type: DataTypes.STRING },
  defaultTillDate: { type: DataTypes.BOOLEAN },
  reasonOfDefault: { type: DataTypes.STRING },
  otherIncomeSource: { type: DataTypes.STRING },
  otherIncome: { type: DataTypes.INTEGER },
  coApplicant: { type: DataTypes.INTEGER },
  sharedlender: {type: DataTypes.ARRAY(DataTypes.UUID)},
  sharedtype:{
    type: DataTypes.ENUM("Only", "Except","All"),
  },
  dsaID: { type: DataTypes.UUID },
  createdAt: {
    allowNull: false,
    type: Sequelize.DATE,
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE,
  },
});

const interestedLender = sequelize.define("interestedLender", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  status: {
    type: DataTypes.STRING,
  },
  rateOfInterest: {
    type: DataTypes.FLOAT,
  },
  processingFee: {
    type: DataTypes.DECIMAL(10, 2),
  },
  maximumTenure: {
    type: DataTypes.INTEGER,
  },
  insuranceRequired: {
    type: DataTypes.BOOLEAN,
  },

  message: {
    type: DataTypes.STRING,
  },

  createdAt: {
    allowNull: false,
    type: Sequelize.DATE,
  },
  updatedAt: {
    allowNull: false,
    type: Sequelize.DATE,
  },

  dsaId: {
    type: DataTypes.UUID,
  },
  caseId: {
    type: DataTypes.UUID,
  },
  lenderId: {
    type: DataTypes.UUID,
  },
});

caseDetails.belongsTo(dsaOnbording, { foreignKey: "dsaID" });

caseDetails.belongsToMany(lenderModel, {
  through: "interestedLender", // This is the junction table
  foreignKey: "caseId",
  otherKey: "lenderId", // Specify the other key
  as: "lenders", 
});
lenderModel.belongsToMany(caseDetails, {
  through: "interestedLender", // This is the junction table
  foreignKey: "lenderId",
  otherKey: "caseId", // Specify the other key
  as: "cases", // Alias for cases in lenderModel
});

module.exports = { caseDetails, interestedLender };
