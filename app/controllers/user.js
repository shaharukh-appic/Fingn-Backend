const { Op } = require("sequelize");
const userModel = require("../../models/user");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const communityChatModel =
  require("../../models/communityChatModel").communityChatModel;
const contactUsModel = require("../../models/contactus");
const Sequelize = require("sequelize");
const jwt = require("jsonwebtoken");

let userController = {
  userSignUp: async (req, res) => {
    try {
      let email = req.body.email;
      console.log(email, "emaillll");
      let check = await userModel.findAll({ where: { email: email } });
      console.log(check, "checkkk");
      if (check.length > 0  && email !== null && email !== "" && email !== undefined ) {
        res.status(200).json({
          status: false,
          message: "You Are Already A Member Of Finjin",
          // result:check
        });
      } else {
        const hashPassword = await bcrypt.hash(req.body.password, 10);
        console.log(hashPassword, "hashPassworddddd");
        let otherValue = null;

        if (
          req.body.natureOfCompany !== "Lender" &&
          req.body.natureOfCompany !== "DSA/Financial Consultancy"
        ) {
          otherValue = "other";
        }
        let payload = {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          companyName: req.body.companyName,
          jobTitle: req.body.jobTitle,
          ExperienceInLendingIndustry: req.body.ExperienceInLendingIndustry,
          email: req.body.email,
          other:otherValue,
          password: hashPassword,
          mobileNo: req.body.mobileNo,
          natureOfCompany: req.body.natureOfCompany,
        };
       
        let record = await userModel.create(payload);
        // const userRecord = await userModel.create({
        //     firstName:req.body.firstName,
        //     lastName:req.body.lastName,
        //     email:req.body.email,
        //     password:hashPassword,
        //     mobileNo:req.body.mobileNo,
        //     registerAs:req.body.registerAs
        // })

        //
        // const otp =Math.floor(1000 +Math.random()*9000)
        // let transporter = await nodemailer.createTransport({
        //     host: "smtp.gmail.com",
        //     port: 465,
        //     secure: true, // true for 465, false for other ports
        // auth: {
        //     user:'kalpitsharma.appicsoftwares@gmail.com',
        //     pass: 'braolodpqjpxmmnl'
        // },
        // })

        // const mailOption = {
        //     from: '"kalpit sharma " <kalpitsharma.appicsoftwares@gmail.com>', // sender address
        //     to: req.body.email, // list of receivers
        //     subject: "Your verification code for Finjin", // Subject line
        //     text: "Your verification code for Finjin", // plain text body
        //     html: `otp: ${otp}`, // html body
        // }
        // let result = await userModel.update(
        //     {emailOtp:otp},
        //     {where:{id:userRecord.id},
        //     returning: true
        // })
        // console.log(result,'resultt')

        // //     const value = new userModel({
        // //         otp:otp
        // //     })
        // //   await value.save()

        // await transporter.sendMail(mailOption)
        //
        console.log(record, "userRecorddddd");
        res.status(200).json({
          status: true,
          message: "You Have Successfully Registered With Finjin",
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

  otpVerify: async (req, res) => {
    let id = req.body.id;
    try {
      let value = await userModel.findOne({
        where: { id: id },
      });

      if (value) {
        console.log(value.emailOtp);
        console.log(value.emailOtp);

        if (value.emailOtp == req.body.emailOtp) {
          let userModeldata = await userModel.update(
            { isverified: true },
            { where: { id: value.id } }
          );
          let token = jwt.sign(id, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
          //  console.log(record,'recorddd')
          res.status(200).json({
            status: true,
            message: "otp verified",
            token: token,
          });
        } else {
          res.status(200).json({
            status: false,
            message: "wrong otp",
          });
        }
      } else {
        res.status(400).json({
          status: true,
          message: "User does  not exist with this id",
        });
      }
    } catch (err) {
      console.log(err, "errrririr");
      res.status(201).json({
        error: err.message,
        status: false,
        message: "something went wrong",
      });
    }
  },

  userLogin: async (req, res) => {
    try {
      let email = req.body.email;
      let check = await userModel.findOne({ where: { email: email } });
      if (check === null) {
        return res.status(400).json({
          status: false,
          message: "email is not valid",
        });
      } else {
        let result = await bcrypt.compare(req.body.password, check.password);
        if (result) {
          let token = jwt.sign(email, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9");
          return res.status(200).json({
            status: true,
            message: "You Have Successfully Logged-In To Finjin",
            result: check,
            token: token,
          });
        } else {
          return res.status(400).json({
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

  search: async (req, res) => {
    const searchValue = req.body.searchValue;
    const tags = req.body.typeForQuestion;

    try {
      let whereCondition = {};

      if (searchValue) {
        whereCondition[Op.and] = [
          {
            oneLineQuestion: {
              [Op.iRegexp]: Sequelize.literal(`'.*${searchValue}.*'`),
            },
          },
        ];
      }

      if (tags && tags.length > 0) {
        whereCondition[Op.and] = whereCondition[Op.and] || [];
        whereCondition[Op.and].push({
          typeForQuestion: {
            [Op.overlap]: tags,
          },
        });
      }

      let value = await communityChatModel.findAll({
        where: whereCondition,
      });

      res.status(200).json({
        result: value,
        status: true,
        message: "data",
      });
    } catch (err) {
      res.status(201).json({
        result: err.message,
        status: true,
        message: "search data",
      });
    }
  },

  resendOtp: async (req, res) => {
    try {
      let value = await userModel.findOne({
        where: {
          email: req.body.email,
        },
      });
      console.log(value, "valueee");
      let email = req.body.email;
      if (value && value.email == req.body.email) {
        let result = await userModel.update(
          { emailOtp: 123456 },

          {
            where: {
              id: value.id,
            },
          }
        );
        if (result) {
          res.status(200).json({
            status: true,
            message: "otp send to your email",
          });
        }
      } else {
        return res.status(200).json({
          status: false,
          message: "user not exist",
        });
      }
    } catch (error) {
      res.status(400).json({
        status: false,
        message: "somethig went wrong",
        error: error.message,
      });
    }
  },
  contactUs: async (req, res) => {
    try {
      
      const {
        firstName,
        lastName,
        companyName,
        jobTitle,
        email,
        mobileNo,
        natureOfBusiness,
        ExperienceInLendingIndustry,
        yourQuery,
        other,
        status,
      } = req.body;

      let otherValue = "null";

      if (
        natureOfBusiness !== "Lender" &&
        natureOfBusiness !== "DSA/Financial Consultancy"
      ) {
        otherValue = "other";
      }

      const newContactUs = await contactUsModel.create({
        firstName,
        lastName,
        companyName,
        jobTitle,
        email,
        mobileNo,
        natureOfBusiness,
        ExperienceInLendingIndustry,
        yourQuery,
        other: otherValue,
        status,
      });

      // Respond with the newly created contactus record
      res
        .status(200)
        .json(
          `Dear ${
            newContactUs.firstName + " " + newContactUs.lastName
          },Thankyou Your inquiry is important to us. Please allow us 24-48 hours for us to review your message and provide a detailed response.`
        );
    } catch (error) {
      console.error("Error creating contactus record:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
  changepassword: async (req, res) => {
    const userId = req.params.id;
    const { newPassword } = req.body;
    if (!userId || !newPassword) {
      res.status(400).json({ error: "User ID and new password are required." });
      return;
    }

    try {
      let value = await userModel.findOne({
        where: {
          id: userId,
        },
      });
      if (!value) {
        res.status(404).json({ error: "User not found." });
        return;
      }

      // Update the user's password
      const hashPassword = await bcrypt.hash(newPassword, 10);

      let result = await userModel.update(
        { password: hashPassword },
        {
          where: {
            id: value.id,
          },
        }
      );

      res
        .status(200)
        .json({ message: "Password updated successfully.", status: true });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  Forgotpassword: async (req, res) => {
    try {
      let email = req.body.email;

      let value = await userModel.findOne({
        where: {
          email: email,
        },
      });
      console.log(value, "valueee");

      if (value && value.email == req.body.email) {
        let result = await userModel.update(
          { emailOtp: 123456 },
          {
            where: {
              id: value.id,
            },
          }
        );
        if (result) {
          res.status(200).json({
            status: true,
            message: "OTP sent to your email for reseting Password",
            result: value,
          });
        }
      } else {
        return res.status(200).json({
          status: false,
          message: "user  does not exist for this email -" + email,
        });
      }
    } catch (error) {
      res.status(400).json({
        status: false,
        message: "somethig went wrong",
        error: error.message,
      });
    }
  },
};

module.exports = userController;
