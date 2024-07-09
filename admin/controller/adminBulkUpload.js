const excelToJson = require("convert-excel-to-json");

const { Op } = require("sequelize");
const questionModel = require("../../models/admin/Questions");

let adminbulkuploadController = {
  adminbulkUpload: async (req, res) => {
    try {
      const newSheet = req.file.path;
      var result = excelToJson({
        sourceFile: newSheet,
        header: { rows: 1 },
        columnToKey: {
          A: "Questions",
          B: "DefaultAnswer",
          C: "ParentQuestionID",
          D: "childQuestionID",
          E: "serialNo",
        },
      });
      console.log(result, "resultttttt");

      let value = await questionModel.bulkCreate(result.adminupload);
      console.log(value, "valueeee");
      res.status(200).json({
        status: true,
        result: value,
        message: "successfully uploadd all record",
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: "something went wrong",
        error: error.message,
      });
    }
  },

  getadminbulk: async (req, res) => {
    try {
      let id = req.params.id;
      console.log(id, "idd");
      let value = await questionModel.findAll({
        where: {
          ParentQuestionID: id,
        },
      });
      console.log(value, "valuee");
      if (value) {
        res.status(200).json({
          status: true,
          message: "successfully get bulk upload data",
          result: value,
        });
      }
    } catch (error) {
      res.status(400).json({
        status: false,
        message: "something went wrong",
        error: error.message,
      });
    }
  },
};

module.exports = adminbulkuploadController;
