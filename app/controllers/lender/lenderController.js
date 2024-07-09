const { Op } = require("sequelize");
const lenderModel = require("../../../models/lenderModel");
const { caseDetails } = require("./../../../models/caseModel");
const Tesseract = require("tesseract.js");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define the extractDataFromVisitingCard function
function extractDataFromVisitingCard(ocrText) {
  const extractedData = {};

  // Define regular expressions for extracting fields based on labels
  const patterns = {
    firstName: /First Name:\s*([A-Za-z\s.]+)(?![\d])/i,
    lastName: /Last Name:\s*([A-Za-z\s.]+)(?![\d])/i,
    lastName: /Last Name:\s*(.*)/i,
    lendingOrganiztion: /Lending\s*Organiztion:\s*(.*)/i,
    mobileNumber: /Phone:\s*(\+?91)?\s*\d{10}/i,
    date: /Date:\s*(.*)/i,
    lendingExperience: /Experience:\s*(.*)/i,
    product: /Product:\s*(.*)/i,
    referralCode: /Referral Code:\s*(.*)/i,
    city: /City:\s*(.*)/i,
    state: /State:\s*(.*)/i,
    professionalEmail:
      /(?:Title:\s*)?([A-Za-z\s.]+)?\s*Email:\s*([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i,
    recoveryEmail:
      /(?:Title:\s*)?([A-Za-z\s.]+)?\s*Recovery Email:\s*([a-zA-Z0-9._-]+@gmail\.com)/i,
  };

  // Iterate through the patterns and extract data based on labels
  for (const [field, regex] of Object.entries(patterns)) {
    const match = ocrText.match(regex);
    if (match) {
      extractedData[field] = match[1].trim();
    }
  }

  // Check for symbols and extract data based on symbols
  extractedData.professionalEmail =
    extractEmailFromSymbol(ocrText) || extractedData.professionalEmail;
  extractedData.mobileNumber =
    extractPhoneNumberFromSymbol(ocrText) || extractedData.mobileNumber;
  extractedData.lendingOrganiztion =
    extractOrganiztionFromSymbol(ocrText) || extractedData.lendingOrganiztion;
  const locationData = extractLocationFromSymbol(ocrText);
  extractedData.city = locationData.city || extractedData.city;
  extractedData.state = locationData.state || extractedData.state;

  // Handle cases where labels are absent (e.g., extract name if no label is found)
  if (!extractedData.firstName && !extractedData.lastName) {
    const nameData = extractNameWithoutLabel(ocrText);
    extractedData.firstName = nameData.firstName;
    extractedData.lastName = nameData.lastName;
  }

  return extractedData;
}

// Helper function to extract email from symbols
function extractEmailFromSymbol(ocrText) {
  // Define a regular expression to match email patterns within the text
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})/i;
  const matches = ocrText.match(emailRegex);

  // Filter out non-professional emails (if needed)
  if (matches) {
    const professionalEmails = matches.filter((match) => match.includes("@"));
    return professionalEmails[0] || "";
  }

  return "";
}

// Helper function to extract phone number from symbols
function extractPhoneNumberFromSymbol(ocrText) {
  const phoneRegex = /(\+?[0-9]+(?:[-\s()]*[0-9]+){3,})/i;
  const match = ocrText.match(phoneRegex);
  return match ? match[0] : "";
}

// Helper function to extract organization from symbols
function extractOrganiztionFromSymbol(ocrText) {
  const organiztionSymbols = ["🏢", "🏭", "🏪"]; 
  for (const symbol of organiztionSymbols) {
    if (ocrText.includes(symbol)) {
      const lines = ocrText.split("\n");
      for (const line of lines) {
        if (line.includes(symbol)) {
          return line.replace(symbol, "").trim();
        }
      }
    }
  }
  return "";
}

// Helper function to extract location from symbols
function extractLocationFromSymbol(ocrText) {
  const locationSymbols = ["📍", "🌆", "🏞️"]; 
  for (const symbol of locationSymbols) {
    if (ocrText.includes(symbol)) {
      const lines = ocrText.split("\n");
      for (const line of lines) {
        if (line.includes(symbol)) {
          const parts = line.split(symbol);
          if (parts.length >= 2) {
            return {
              city: parts[0].trim(),
              state: parts[1].trim(),
            };
          }
        }
      }
    }
  }
  return { city: "", state: "" };
}

// Helper function to extract name when no label is present
function extractNameWithoutLabel(ocrText) {
  // Split the OCR text into lines
  const lines = ocrText.split("\n");

  // Initialize variables to store extracted name, first name, and last name
  let name = "";
  let firstName = "";
  let lastName = "";

  // Attempt to find a labeled "Name" field and extract the name
  for (const line of lines) {
    // Check if the line starts with "Name:" (case-insensitive)
    if (/^name:\s*/i.test(line)) {
      // Extract the name part after "Name:"
      name = line.replace(/^name:\s*/i, "").trim();
      break; // Stop searching once a labeled "Name" field is found
    }
  }

  // If no labeled "Name" field is found, assume the first line contains the name
  if (!name && lines.length > 0) {
    name = lines[0].trim();
  }

  // Split the name into first and last name (assuming a space separates them)
  const nameParts = name.split(" ");
  firstName = nameParts[0] || "";
  lastName = nameParts.slice(1).join(" ") || "";

  // Return the extracted name, first name, and last name
  return { name, firstName, lastName };
}

let lenderController = {
  lenderSignup: async (req, res) => {
    try {
      let professionalEmail = req.body.professionalEmail;
      let check = await lenderModel.findOne({
        where: { professionalEmail: professionalEmail },
      });
      if (check) {
        res.status(400).json({
          status: false,
          message: "professionalEmail already exist",
          result: check,
        });
      } else {
        let signuprecord = await lenderModel.create({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          professionalEmail: req.body.professionalEmail,
          lendingOrganiztion: req.body.lendingOrganiztion,
          mobileNumber: req.body.mobileNumber,
          date: req.body.date,
          lendingExperience: req.body.lendingExperience,
          product: req.body.product,
          referralCode: req.body.referralCode,
          city: req.body.city,
          state: req.body.state,
          recoveryEmail: req.body.recoveryEmail,
        });
        res.status(200).json({
          status: true,
          message: "lender signup successfully",
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

  // Add a method for signing up with a visiting card
  signUpWithVisitingCard: async (req, res) => {
    try {
      // Check if a file was uploaded
      if (!req.file) {
        return res.status(400).json({
          status: false,
          message: "No visiting card image uploaded.",
        });
      }

      // Extract text from the uploaded image
      const imageBuffer = req.file.buffer;
      const ocrResult = await Tesseract.recognize(imageBuffer);
      const extractedText = ocrResult.data.text;

      // Log the extracted OCR text for debugging purposes
      console.log(extractedText, "Extracted OCR Text");

      // Extract specific fields from the OCR text
      const extractedData = extractDataFromVisitingCard(extractedText);

      // Log the extracted data for debugging purposes
      console.log(extractedData, "Extracted Data");

      // Check if the professionalEmail already exists in the database (you need to implement this part)
      // const existingRecord = await lenderModel.findOne({
      //   where: {
      //     professionalEmail: extractedData.professionalEmail,
      //   },
      // });

      // if (existingRecord) {
      //   return res.status(400).json({
      //     status: false,
      //     message: 'Extracted Professional email from visiting card is already exists.',
      //   });
      // }

      // Create a new record in the database using the extracted data (you need to implement this part)
      // const signupRecord = await lenderModel.create(extractedData);

      res.status(200).json({
        status: true,
        message: "Extracted data from visiting card",
        // result: signupRecord.toJSON(),
        result: extractedData,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        status: false,
        message: "Error occurred during signup with visiting card.",
        error: error.message,
      });
    }
  },

  lenderLogin: async (req, res) => {
    try {
      let professionalEmail = req.body.professionalEmail;
      let check = await lenderModel.findOne({
        where: { professionalEmail: professionalEmail },
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
            message: "otp send to this email",
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

  lenderVerifyOtp: async (req, res) => {
    try {
      let id = req.params.id;
      let emailOtp = req.body.emailOtp;
      let recoveryEmailOtp = req.body.recoveryEmailOtp;
      let check = await lenderModel.findOne({
        where: {
          id: id,
          emailOtp: emailOtp,
          recoveryEmailOtp: recoveryEmailOtp,
        },
      });
      if (check) {
        if (check.adminStatus == true) {
          res.status(200).json({
            status: true,
            message: "otp verified successfully",
            result: check,
          });
        } else {
          res.status(401).json({
            status: false,
            message: "email not exist",
          });
        }
      } else {
        res.status(401).json({
          status: false,
          message: "incorrect otp",
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
  getCaseDetail: async (req, res) => {
    try {
      let id = req.query.id;
      if (id) {
        let record = await caseDetails.findOne({
          where: { id: id },
        });
        res.status(200).json({
          status: true,
          message: "single case data found",
          result: record,
        });
      } else {
        // let findquery = {adminStatus:true}
        let record = await caseDetails.findAll({});
        res.status(200).json({
          status: true,
          message: "all case details found",
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
};

module.exports = lenderController;
