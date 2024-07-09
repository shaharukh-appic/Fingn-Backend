const { Op } = require("sequelize");
const {
  communityChatModel,
  AddReply,
} = require("../../models/communityChatModel");

const contactUsModel = require("../../models/contactus");
const { addReply } = require("../../app/controllers/dsa/communityChat");
const userModel = require("../../models/user");

let communityChatController = {
  getChat: async (req, res) => {
    try {
      let id = req.query.id;
      console.log(id, "idd");
      let value;

      if (id) {
        value = await communityChatModel.findOne({
          include: {
            model: AddReply,
            as: "replies",
          },
          where: { id: id },
        });

        if (value) {
          res.status(200).json({
            status: true,
            message: "Getting single chat detail",
            result: value,
          });
        } else {
          res.status(404).json({
            status: false,
            message: "Chat detail not found with the provided ID",
          });
        }
      } else {
        const communityChatData = await communityChatModel.findAll({
          include: {
            model: AddReply,
            as: "replies",
          },
        });

        res.status(200).json({
          status: true,
          message: "Getting all chat details",
          result: communityChatData,
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  },

  getReply: async (req, res) => {
    try {
      const userId = req.query.id;

      if (userId) {
        // Find the user and include their replies
        const user = await userModel.findOne({
          where: { id: userId },
          include: {
            model: AddReply,
            as: "replies",
          },
        });

        if (user) {
          
          const replyData = {};

          // Organize the data into a structured result object
          const result = {
            userId: user.id,
            userName: user.firstName + " " + user.lastName,
            mobileNumber: user.mobileNo,
            email: user.email,
            replyData: {},
          };

          // Loop through the user's replies
          for (const reply of user.replies) {
            const chatId = reply.communityChatId;
            if (!replyData[chatId]) {
              replyData[chatId] = {
                count: 0,
                replies: [],
                oneLineQuestion: null,
              };
            }

            // Increment the reply count
            replyData[chatId].count++;
            replyData[chatId].replies.push(reply);

            // Query the community chat to get the oneLineQuestion
            const communityChat = await communityChatModel.findByPk(chatId);
            if (communityChat) {
              replyData[chatId].oneLineQuestion = communityChat.oneLineQuestion;
            }
          }

          // Transform replyData
          const transformedReplyData = [];

          for (const chatId in replyData) {
            transformedReplyData.push({
              questionID: chatId,
              oneLineQuestion: replyData[chatId].oneLineQuestion,
              count: replyData[chatId].count,
              replies: replyData[chatId].replies,
            });
          }

          result.replyData = transformedReplyData;

          res.status(200).json({
            status: true,
            message: "Getting chat detail with reply count",
            result,
          });
        } else {
          res.status(404).json({
            status: false,
            message: "User not found with the provided ID",
          });
        }
      } else {
        res.status(400).json({
          status: false,
          message: "Please provide a valid user ID in the query parameter",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  },

  updateChat: async (req, res) => {
    try {
      const id = req.params.id;
      console.log(id);

      const slugString = req.body.oneLineQuestion;
      const cleanedString = slugString
        .trim()
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/-$/, "")
        .toLowerCase();

      
      const chat = await communityChatModel.findByPk(id);

      console.log(chat);

      if (chat) {
        const fieldsToUpdate = {
          oneLineQuestion: req.body.oneLineQuestion,
          describeQuestion: req.body.describeQuestion,
          slug: cleanedString,
          typeForQuestion: req.body.typeForQuestion,
          name: req.body.name,
          mobileNumber: req.body.mobileNumber,
        };

        await chat.update(fieldsToUpdate); 

        const updatedChat = await communityChatModel.findByPk(id);

        res.status(200).json({
          status: true,
          message: "Chat updated successfully",
          result: updatedChat,
        });
      } else {
        res.status(404).json({
          status: false,
          message: "Chat not found",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  },

  deleteChat: async (req, res) => {
    try {
      let id = req.params.id;
      let check = await communityChatModel.findOne({ where: { id: id } });
      if (check) {
        let result = await communityChatModel.destroy({ where: { id: id } });
        res.status(200).json({
          status: true,
          message: "succssfully deleted chat",
          result: result[1],
        });
      } else {
        res.status(401).json({
          status: false,
          message: "chat not exist",
        });
      }
    } catch (error) {
      res.status(401).json({
        status: false,
        message: "something went wrong",
        error: error.message,
      });
    }
  },
  getAllContactus: async (req, res) => {
    try {

      if (req.query.id) {
        try {

          const contactUsId = req.query.id;

          const contactUs = await contactUsModel.findByPk(contactUsId);

          if (!contactUs) {
            
            res.status(404).json({ error: "ContactUs record not found" });
            return;
          }

          res.status(200).json(contactUs);
        } catch (error) {
          
          console.error("Error searching for contactus record:", error);
          res.status(500).json({ error: "Internal Server Error" });
        }
      } else {
        const allContactUsRecords = await contactUsModel.findAll();

        res.status(200).json(allContactUsRecords);
      }
    } catch (error) {
      
      console.error("Error retrieving contactus records:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};

module.exports = communityChatController;
