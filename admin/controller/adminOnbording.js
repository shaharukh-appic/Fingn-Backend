// const db = require('../../app/config/sequelize')
// const op = db.Sequelize.op
const { Op } = require("sequelize");
const adminModel = require("../../models/adminModel");
const dsaModel = require("../../models/dsaModel");
const lendersModel = require("../../models/lenderModel");
const userModel = require("../../models/user");
const contactUsModel = require("../../models/contactus");
const lenderModel = require("../../models/lenderModel");
const duplicateLenderModel = require("../../models/duplicateLenderModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let adminController = {
  adminSignup: async (req, res) => {
    try {
      let email = req.body.email;
      console.log(email, "emaillll");
      let check = await adminModel.findAll({ where: { email: email } });
      console.log(check, "checkkk");
      if (check.length > 0) {
        res.status(400).json({
          status: false,
          message: "email already exist",
          result: check,
        });
      } else {
        const hashPassword = await bcrypt.hash(req.body.password, 10);
        console.log(hashPassword, "hashPassworddddd");
        const adminRecord = await adminModel.create({
          email: req.body.email,
          password: hashPassword,
        });
        console.log(adminRecord, "adminRecorddddd");
        res.status(200).json({
          status: true,
          message: "successfully signup",
          result: adminRecord,
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

  adminLogin: async (req, res) => {
    try {
      console.log(req.body, "ccccc");
      let email = req.body.email;
      let check = await adminModel.findOne({
        where: { email: email },
      });
      if (check === null) {
        return res.status(401).json({
          status: false,
          message: "email is not valid",
        });
      } else {
        let result = await bcrypt.compare(req.body.password, check.password);
        if (result) {
          let payload = {
            email: req.body.email,
          };
          let token = jwt.sign(payload, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
          return res.status(200).json({
            status: true,
            message: "successfully login",
            result: check,
            token: token,
          });
        } else {
          return res.status(401).json({
            status: false,
            message: "Please Enter Valid Password",
          });
        }
      }
    } catch (error) {
      res.status(400).json({
        status: false,
        message: "somethig went wrong",
        error: error.message,
      });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email, id, newPassword, currentPassword, userType } = req.body;
      let model;

      switch (userType) {
        case "admin":
          model = adminModel;
          break;
        case "lender":
          model = lendersModel;
          break;
        case "user":
          model = userModel;
          break;
        case "dsa":
          model = dsaModel;
          break;
        default:
          return res.status(400).json({
            status: false,
            message: "Invalid userType",
          });
      }

      if (email) {
        let userExists;

        if (userType === "lender") {
          // Use professionalEmail for the lender user type
          userExists = await model.findOne({
            where: { professionalEmail: email },
          });
        } else {
          userExists = await model.findOne({
            where: { email },
          });
        }

        if (userExists) {
          // Code to send the reset code to the email address
          return res.status(200).json({
            status: true,
            message: "Code sent successfully to this email",
          });
        } else {
          return res.status(401).json({
            status: false,
            message: "Email does not exist",
          });
        }
      } else if (id) {
        const user = await model.findOne({
          where: { id },
        });

        if (user) {
          const validPassword = await bcrypt.compare(
            currentPassword,
            user.password
          );

          if (validPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            const [rowsUpdated] = await model.update(
              { password: hashedPassword },
              { where: { id }, returning: true }
            );

            return res.status(200).json({
              status: true,
              result: rowsUpdated[1],
              message: "Password successfully updated",
            });
          } else {
            return res.status(401).json({
              status: false,
              message: "Current password is wrong",
            });
          }
        } else {
          return res.status(401).json({
            status: false,
            message: "User with the given ID does not exist",
          });
        }
      } else {
        return res.status(400).json({
          status: false,
          message: "Missing required parameters",
        });
      }
    } catch (error) {
      res.status(400).json({
        status: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  },

  // forgotPassword:async(req,res)=>{
  //     try {
  //         if(req.body.email){
  //             let email = req.body.email;
  //             let check = await adminModel.findOne({
  //                 where:{email:email}
  //             })
  //             if(check){
  //                 res.status(200).json({
  //                     status:true,
  //                     message:"code send successfully to this email",
  //                 })
  //             }else{
  //                 res.status(401).json({
  //                     status:false,
  //                     message:"email doesn't exist",
  //                 })
  //             }
  //         }else{
  //             let id = req.body.id
  //             let result = await adminModel.findOne({
  //                where:{id:id}
  //             })
  //             if(result){
  //                 let hashPassword  = await bcrypt.hash(req.body.newPassword,10)
  //                 if(req.body.currentPassword){
  //                     // if(req.body.newPassword==req.body.confirmPassword){
  //                         let validPassword = await bcrypt.compare(req.body.currentPassword,result.password)
  //                         if(validPassword){
  //                             let result = await adminModel.update({password:hashPassword},{
  //                                             where:{id:id},
  //                                             returning: true
  //                             })
  //                             res.status(200).json({
  //                                 status:true,
  //                                 result:result[1],
  //                                 message:"successfully updated password"
  //                             })
  //                         }else{
  //                             res.status(401).json({
  //                                 status:false,
  //                                 message:"current password is wrong",
  //                             })
  //                         }
  //                     // }else{
  //                     //     res.status(401).json({
  //                     //         status:false,
  //                     //         message:"newPassword and confirmPassword not matched",
  //                     //     })
  //                     // }
  //                 }

  //             }else{
  //                 res.status(401).json({
  //                     status:false,
  //                     message:"id doesn't exist",
  //                 })
  //             }
  //         }

  //     } catch (error) {
  //         res.status(400).json({
  //             status:false,
  //             message:'somethig went wrong',
  //             error:error.message
  //           })
  //     }
  // },

  getDsa: async (req, res) => {
    try {
      let id = req.query.id;
      if (id) {
        let record = await dsaModel.findOne({
          where: { id: id, adminStatus: true },
        });
        res.status(200).json({
          status: true,
          message: "single dsa data found",
          result: record,
        });
      } else {
        let record = await dsaModel.findAll({ where: { adminStatus: true } });
        res.status(200).json({
          status: true,
          message: "all dsa data found",
          result: record,
        });
      }
    } catch (error) {
      res.status(400).json({
        status: false,
        message: "something went wrong",
        error: error.message,
      });
      console.log(error.message);
    }
  },

  getLender: async (req, res) => {
    try {
      let id = req.query.id;
      if (id) {
        let record = await lendersModel.findOne({
          where: { id: id, adminStatus: true },
        });
        res.status(200).json({
          status: true,
          message: "single lender data found",
          result: record,
        });
      } else {
        // let findquery = {adminStatus:true}
        let record = await lendersModel.findAll({
          where: { adminStatus: true },
        });
        res.status(200).json({
          status: true,
          message: "all lenders data found",
          result: record,
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

  getUser: async (req, res) => {
    try {
      let id = req.query.id;
      if (id) {
        let record = await userModel.findOne({
          where: { id: id },
        });
        if (record) {
          res.status(200).json({
            status: true,
            message: "single user data found",
            result: record,
          });
        } else {
          res.status(400).json({
            status: false,
            message: "User not exists with this id",
            result: record,
          });
        }
      } else {
        let record = await userModel.findAll({});
        if (record) {
          res.status(200).json({
            status: true,
            message: "all users data found",
            result: record,
          });
        } else {
          res.status(400).json({
            status: false,
            message: "No user here",
            result: record,
          });
        }
      }
    } catch (error) {
      res.status(400).json({
        status: false,
        message: "something went wrong",
        error: error.message,
      });
      console.log(error.message);
    }
  },

  deleteUser: async (req, res) => {
    try {
      let id = req.params.id;
      // let updatequery = {
      //     adminStatus:false
      // }

      const result = await userModel.destroy({ where: { id: id } });
      if (result) {
        res.status(200).json({
          status: true,
          message: "successfully deleted",
          result: result[1],
        });
      } else {
        res.status(401).json({
          status: false,
          message: "not deleted ( User not found )",
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

  updateUser: async (req, res) => {
    try {
      const id = req.params.id;
      const user = await userModel.findByPk(id);

      if (!user) {
        return res.status(400).json({
          status: false,
          message: "User not found",
        });
      }

      const fieldsToUpdate = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        companyName: req.body.companyName,
        jobTitle: req.body.jobTitle,
        ExperienceInLendingIndustry: req.body.ExperienceInLendingIndustry,
        email: req.body.mobileNo,
        mobileNo: req.body.mobileNo,
        natureOfCompany: req.body.natureOfCompany,
      };

      const [updatedCount, updatedUsers] = await userModel.update(
        fieldsToUpdate,
        {
          where: { id },
          returning: true,
        }
      );

      if (updatedCount > 0) {
        return res.status(200).json({
          status: true,
          message: "User updated successfully",
          result: updatedUsers,
        });
      } else {
        return res.status(400).json({
          status: false,
          message: "User not updated",
        });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        status: false,
        message: "Error updating user",
        error: error.message,
      });
    }
  },

  deleteDsa: async (req, res) => {
    try {
      let id = req.params.id;
      // let updatequery = {
      //     adminStatus:false
      // }

      let result = await dsaModel.update(
        { adminStatus: false },
        { where: { id: id }, returning: true }
      );
      if (result) {
        res.status(200).json({
          status: true,
          message: "successfully deleted",
          result: result[1],
        });
      } else {
        res.status(401).json({
          status: false,
          message: "not deleted",
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

  deleteLender: async (req, res) => {
    try {
      let id = req.params.id;
      // let updatequery = {
      //     adminStatus:false
      // }

      let result = await lendersModel.update(
        { adminStatus: false },
        { where: { id: id }, returning: true }
      );
      if (result) {
        res.status(200).json({
          status: true,
          message: "successfully deleted",
          result: result[1],
        });
      } else {
        res.status(401).json({
          status: false,
          message: "not deleted",
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

  updateDsa: async (req, res) => {
    try {
      let id = req.params.id;
      console.log(id, "idd");
      let check = await dsaModel.findOne({
        where: {
          id: req.params.id,
          adminStatus: true,
        },
      });
      console.log(check, "checkk");
      if (check.length > 0) {
        let email = req.body.email;
        let checking = await dsaModel.findOne({
          where: {
            email: req.body.email,
            adminStatus: true,
          },
        });
        console.log(checking, "checkinggggggggggg");
        if (check.email !== req.body.email && checking !== null) {
          res.status(401).json({
            status: false,
            message: "email already exist",
            result: checking,
          });
        } else {
          //  let update = {id:req.params.id,adminStatus:true,adminStatus:false}
          let updatequery = {
            email: req.body.email,
            status: req.body.status,
            referralCode: req.body.referralCode,
            aadharNumber: req.body.aadharNumber,
            panNumber: req.body.panNumber,
          };
          let result = await dsaModel.update(updatequery, {
            where: {
              id: req.params.id,
              [Op.and]: [{ adminStatus: true }, { adminStatus: false }],
            },
            returning: true,
          });
          if (result[0] > 0) {
            res.status(200).json({
              status: true,
              result: result[1],
              message: "successfuly updated dsa record",
            });
          } else {
            res.status(400).json({
              status: false,
              message: "not updated dsa record",
            });
          }
        }
      } else {
        res.status(400).json({
          status: false,
          message: "DSA not exist",
        });
      }
    } catch (error) {
      res.status(400).json({
        status: false,
        message: "something went wrong",
        error: error.message,
      });
      console.log(error);
    }
  },

  verifyLenderUpdate: async (req, res) => {
    try {
      const id = req.params.id;
      console.log(id, "idddddddddd");
      const adminDecision = req.body.adminDecision;
      console.log(adminDecision, "adminDecisionnnnnnn"); // 'verified' or 'rejected'

      const duplicateLender = await duplicateLenderModel.findOne({
        where: { lenderId: id },
      });
      if (!duplicateLender) {
        return res.status(400).json({
          status: false,
          message: "Duplicate lender data not found.",
        });
      }

      if (adminDecision === "rejected") {
        const updateResult = await lenderModel.update(
          { updateVerificationStatus: "rejected" },
          {
            where: { id: id },
          }
        );
        if (updateResult) {
          await duplicateLenderModel.destroy({
            where: {
              lenderId: id,
            },
          });
          res.status(200).json({
            status: true,
            message: "Not approved by admin",
          });
        } else {
          res.status(400).json({
            status: false,
            message: "Failed to update lender model",
          });
        }
      } else if (adminDecision === "verified") {
        const duplicateLenderData = duplicateLender.toJSON();
        const updateResult = await lenderModel.update(
          {
            professionalEmail: duplicateLenderData.professionalEmail,
            lendingOrganiztion: duplicateLenderData.lendingOrganiztion,
            mobileNumber: duplicateLenderData.mobileNumber,
            lendingExperience: duplicateLenderData.lendingExperience,
            yourProduct: duplicateLenderData.yourProduct,
            employeeCode: duplicateLenderData.employeeCode,
            yourDesignation: duplicateLenderData.yourDesignation,
            reportingManager: duplicateLenderData.reportingManager,
            repoManDesignation: duplicateLenderData.repoManDesignation,
            updateVerificationStatus: "verified",
          },
          {
            where: { id: id },
          }
        );
        if (updateResult) {
          await duplicateLenderModel.destroy({
            where: {
              lenderId: id,
            },
          });
          res.status(200).json({
            status: true,
            message: "Approved by admin",
          });
        } else {
          res.status(400).json({
            status: false,
            message: "Failed to update lender model",
          });
        }
      }
    } catch (error) {
      console.error("Error:", error);
      res.status(400).json({
        status: false,
        message: "something went wrong",
        error: error.message,
      });
    }
  },
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

        let signuprecord = await dsaModel.create({
          email: req.body.email,
          referralCode: req.body.referralCode,
          mobileNumber: req.body.mobileNumber,
          fullName: req.body.fullName,
          dateOfBirth: req.body.dateOfBirth,
          expeFinanceIndus: req.body.expeFinanceIndus,
          uploadpan: uploadpan,
          aadharfront: aadharfront,
          aadharback: aadharback,
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
};

module.exports = adminController;
