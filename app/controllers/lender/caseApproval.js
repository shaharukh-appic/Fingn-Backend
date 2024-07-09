const { interestedLender } = require("../../../models/caseModel");

const lenderApproval = async (req, res) => {
  try {
    // Extract data from the request body
    const {
      status,
      rateOfInterest,
      processingFee,
      maximumTenure,
      insuranceRequired,
      message,
      dsaId,
      caseId,
      lenderId,
    } = req.body;

    const newInterest = await interestedLender.create({
      status,
      rateOfInterest,
      processingFee,
      maximumTenure,
      insuranceRequired,
      message,
      dsaId,
      caseId,
      lenderId,
    });

    res.status(201).json({
      status: true,
      message: "Lender interest added successfully",
      result: newInterest,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: false,
      message: "Failed to add lender interest",
      error: error.message,
    });
  }
};

module.exports = lenderApproval;
