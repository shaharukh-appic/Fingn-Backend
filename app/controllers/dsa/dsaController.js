const { Op } = require("sequelize");
const dsaModel = require("../../../models/dsaModel");

let dsaController = {
  dsaSignup: async (req, res) => {
    try {
      let email = req.body.email;
      let check = await dsaModel.findOne({
        where: { email: email, adminStatus: true },
      });
      console.log(check, "checkkk");
      if (check) {
        res.status(400).json({
          status: false,
          message: "email already exist",
          result: check,
        });
      } else {
        let signuprecord = await dsaModel.create({
          email: req.body.email,
          referralCode: req.body.referralCode,
        });
        res.status(200).json({
          status: true,
          message: "sign up successfully",
          result: signuprecord,
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

  dsaLogin: async (req, res) => {
    try {
      let email = req.body.email;
      let check = await dsaModel.findOne({
        where: { email: email },
      });
      if (check === null) {
        res.status(400).json({
          status: false,
          message: "wrong email",
        });
      } else {
        if (check.adminStatus == true) {
          res.status(200).json({
            status: true,
            message: "otp send to your mobileNo. and email",
            result: check,
          });
        } else {
          res.status(200).json({
            status: true,
            message: "email not exist",
          });
        }
      }
    } catch (error) {
      res.status(400).json({
        status: false,
        message: "something went wrong",
        error: error.message,
      });
    }
  },

  dsaVerifyOtp: async (req, res) => {
    try {
      let id = req.params.id;
      let emailOtp = req.body.emailOtp;
      let mobileOtp = req.body.mobileOtp;
      let check = await dsaModel.findOne({
        where: { id: id },
      });
      if (check.emailOtp !== req.body.emailOtp) {
        res.status(400).json({
          status: false,
          message: "email otp is wrong",
        });
      } else if (check.mobileOtp !== req.body.mobileOtp) {
        res.status(400).json({
          status: false,
          message: "mobile otp is wrong",
        });
      } else if (check.mobileOtp == mobileOtp && check.emailOtp == emailOtp) {
        res.status(200).json({
          status: true,
          message: "email otp and mobile otp are verified",
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

  dsaUpdate: async (req, res) => {
    try {
      let id = req.params.id;
      let check = await dsaModel.findOne({
        where: { id: id },
      });
      if (check) {
        console.log(req.files, "req.file*************");
        let uploadpan =
          req.files && req.files.uploadpan
            ? req.files.uploadpan[0].originalname
            : req.body.uploadpan;
        let aadharfront =
          req.files && req.files.aadharfront
            ? req.files.aadharfront[0].originalname
            : req.body.aadharfront;
        let aadharback =
          req.files && req.files.aadharback
            ? req.files.aadharback[0].originalname
            : req.body.aadharback;

        let payload = {
          fullName: req.body.fullName,
          address: req.body.address,
          street: req.body.street,
          pinCode: req.body.pinCode,
          city: req.body.city,
          state: req.body.state,
          dateOfBirth: req.body.dateOfBirth,
          expeFinanceIndus: req.body.expeFinanceIndus,
          uploadpan: uploadpan,
          aadharfront: aadharfront,
          aadharback: aadharback,
        };
        console.log(payload, "payload%%%%%%%%%%%%");
        let [rowsUpdated, updatedRows] = await dsaModel.update(payload, {
          where: { id: id },
          returning: true,
        });
        if (rowsUpdated > 0) {
          res.status(200).json({
            status: true,
            message: "successfully updated record",
            result: updatedRows[0],
          });
        } else {
          res.status(400).json({
            status: false,
            message: "data not updated",
          });
        }
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

module.exports = dsaController;
