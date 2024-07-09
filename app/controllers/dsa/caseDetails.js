const { caseDetails } = require("../../../models/caseModel");
const { interestedLender } = require("../../../models/caseModel");

const caseInfo = {
  caseDetail: async (req, res) => {
    try {

      const {
        loanType,
        flag,
        loanCategory,
        lenderName,
        loanAmount,
        propertyValue,
        propertyStatus,
        propertyType,
        propertyUses,
        propertyOwnership,
        propertyPincode,
        nameOfKeyApplicant,
        age,
        residencePin,
        residenceType,
        occupiedDuration,
        sourceIncome,
        workingOrgType,
        currentExperience,
        totalExperience,
        aboutClient,
        monthlySalary,
        monthlyEmi,
        cibilScore,
        defaultTillDate,
        reasonOfDefault,
        otherIncomeSource,
        otherIncome,
        coApplicant,
        dsaID,
      } = req.body;

      // Create a new record in the "caseDetails" table
      const newCaseDetails = await caseDetails.create({
        loanType,
        flag,
        loanCategory,
        lenderName,
        loanAmount,
        propertyValue,
        propertyStatus,
        propertyType,
        propertyUses,
        propertyOwnership,
        propertyPincode,
        nameOfKeyApplicant,
        age,
        residencePin,
        residenceType,
        occupiedDuration,
        sourceIncome,
        workingOrgType,
        currentExperience,
        totalExperience,
        aboutClient,
        monthlySalary,
        monthlyEmi,
        cibilScore,
        defaultTillDate,
        reasonOfDefault,
        otherIncomeSource,
        otherIncome,
        coApplicant,
        dsaID,
      });

      // Send a success response
      res
        .status(201)
        .json({
          message: "Case details added successfully",
          caseDetails: newCaseDetails,
        });
    } catch (error) {
      // Handle errors and send an error response
      console.error(error);
      res.status(500).json({ error: "Failed to add case details" });
    }
  },

  getCaseApproval: async (req, res) => {
    try {
      const { caseId } = req.query;
      const whereClause = caseId ? { caseId } : {}; 

      const interestedLenders = await interestedLender.findAll({
        where: whereClause,
      });

      if (interestedLenders.length === 0) {
        return res.status(404).json({
          status: false,
          message: caseId
            ? "No interested lenders found for the specified case."
            : "No interested lenders found for any case.",
        });
      }

      res.status(200).json({
        status: true,
        message: caseId
          ? "Interested lenders for the specified case retrieved successfully."
          : "All interested lenders retrieved successfully.",
        data: interestedLenders,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: caseId
          ? "Failed to retrieve interested lenders for the specified case."
          : "Failed to retrieve interested lenders for any case.",
        error: error.message,
      });
    }
  },
};

module.exports = caseInfo;
