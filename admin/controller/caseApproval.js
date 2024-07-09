const { interestedLender } = require("../../models/caseModel");

const caseApprovel = {
  getLenderInterests: async (req, res) => {
    try {
      
      const allLenderInterests = await interestedLender.findAll();

      if (allLenderInterests.length === 0) {
        return res.status(404).json({
          status: false,
          message: "No lender interests found.",
        });
      }

      res.status(200).json({
        status: true,
        message: "Lender interests retrieved successfully.",
        data: allLenderInterests,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: "Failed to retrieve lender interests.",
        error: error.message,
      });
    }
  },
};

module.exports = caseApprovel;
