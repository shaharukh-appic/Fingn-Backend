const { Sequelize, DataTypes } = require("sequelize");
const lenderModel = require("../../../models/lenderModel");
const duplicateLenderModel = require("../../../models/duplicateLenderModel");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

let profileController = {
  // createProfile:async(req,res)=>{
  //     try {
  //         // Handle file upload for visiting card (assuming you're using multer)
  //         let visitingCard;
  //         if (req.file) {
  //           visitingCard = req.file.originalname;
  //         } else {
  //           visitingCard = req.body.visitingCard;
  //         }

  //         // Create a new profile record
  //         const newProfile = await lenderModel.create({
  //           yourProduct: req.body.yourProduct,
  //           employeeCode: req.body.employeeCode,
  //           yourDesignation: req.body.yourDesignation,
  //           reportingManager: req.body.reportingManager,
  //           repoManDesignation: req.body.repoManDesignation,
  //           visitingCard: visitingCard,
  //           dateOfBirth: req.body.dateOfBirth,
  //           city: req.body.city,
  //           state: req.body.state,
  //           personalEmail: req.body.personalEmail,
  //           residentialAddress: req.body.residentialAddress,
  //           areMarried: req.body.areMarried,
  //           spouseName: req.body.spouseName,
  //           spouseDoB: req.body.spouseDoB,
  //           marriageAnniversary: req.body.marriageAnniversary,
  //         });

  //         res.status(200).json({
  //           status: true,
  //           message: 'Successfully created profile',
  //           result: newProfile,
  //         });
  //       } catch (error) {
  //         res.status(400).json({
  //           status: false,
  //           message: 'Something went wrong',
  //           error: error.message,
  //         });
  //       }
  // },

  updateLenderProfile: async (req, res) => {
    const id = req.params.id;

    // Check if the lender exists and adminStatus is true
    const lender = await lenderModel.findOne({
      where: {
        id,
        adminStatus: true,
      },
    });

    if (!lender) {
      return res.status(400).json({
        status: false,
        message: "Lender not found or not authorized.",
      });
    }

    // Check if the verification status is 'verified' to disallow updates
    if (lender.verificationStatus === "verified") {
      return res.status(400).json({
        status: false,
        message:
          "Lender profile updates can only be made when in a pending state.",
      });
    }

    // Check if a pending verification for the same lenderId already exists in duplicateLenderModel
    const existingDuplicate = await duplicateLenderModel.findOne({
      where: {
        lenderId: id,
        updateVerificationStatus: "pending",
      },
    });

    if (existingDuplicate) {
      return res.status(400).json({
        status: false,
        message: "Lender is already in pending status for verification.",
      });
    }

    // Check if professionalEmail or mobileNumber already exist in lenderModel
    const emailExists = await lenderModel.findOne({
      where: {
        professionalEmail: req.body.professionalEmail,
      },
    });

    const mobileExists = await lenderModel.findOne({
      where: {
        mobileNumber: req.body.mobileNumber,
      },
    });

    if (emailExists) {
      return res.status(400).json({
        status: false,
        message: "Professional email already exists in the lender model.",
      });
    }

    if (mobileExists) {
      return res.status(400).json({
        status: false,
        message: "Mobile number already exists in the lender model.",
      });
    }


    const updatedFields = {
      lenderId: id,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      professionalEmail: req.body.professionalEmail,
      lendingOrganiztion: req.body.lendingOrganiztion,
      mobileNumber: req.body.mobileNumber,
      lendingExperience: req.body.lendingExperience,
      yourProduct: req.body.yourProduct,
      employeeCode: req.body.employeeCode,
      yourDesignation: req.body.yourDesignation,
      reportingManager: req.body.reportingManager,
      repoManDesignation: req.body.repoManDesignation,

    };

    if (req.file) {
      // Handle file uploads
      const uploadedFile = req.file;
      const originalname = uploadedFile.originalname;

      // Append the file extension to the visitingCard field
      updatedFields.visitingCard = originalname;
    }

    // Create a new record in the duplicate model with 'pending' status
    const duplicateLender = await duplicateLenderModel.create({
      ...updatedFields,
      verificationStatus: "pending",
    });

    return res.status(200).json({
      status: true,
      message: "Lender profile updates are pending verification.",
      data: duplicateLender,
    });
  },

  updatePersonalInfo: async (req, res) => {
    try {
      const id = req.params.id;

      const lender = await lenderModel.findByPk(id);

      if (lender) {

        const fieldsToUpdate = {
          dateOfBirth: req.body.dateOfBirth,
          city: req.body.city,
          state: req.body.state,
          personalEmail: req.body.personalEmail,
          residentialAddress: req.body.residentialAddress,
          areMarried: req.body.areMarried,
          spouseName: req.body.spouseName,
          spouseDob: req.body.spouseDob,
          marriageAnniversary: req.body.marriageAnniversary,
        };

        await lender.update(fieldsToUpdate);

        const updatedLender = await lenderModel.findByPk(id);

        res.status(200).json({
          status: true,
          message: "Profile updated successfully",
          result: updatedLender,
        });
      } else {
        res.status(404).json({
          status: false,
          message: "Profile not found",
        });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: false,
        message: "Error updating profile",
        error: error.message,
      });
    }
  },
};

module.exports = profileController;
