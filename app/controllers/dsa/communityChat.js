const { Op } = require("sequelize");
const {
  communityChatModel,
  AddReply,
} = require("../../../models/communityChatModel");

const userModel = require("../../../models/user");

let communityChatController = {
  askQuestion: async (req, res) => {
    try {
      const typeForQuestion = req.body.typeForQuestion;
      const slugString = req.body.oneLineQuestion;
      const cleanedString = slugString
        .trim()
        .replace(/[^a-zA-Z0-9]+/g, "-")
        .replace(/-$/, "")
        .toLowerCase();

      const createdChat = await communityChatModel.create({
        oneLineQuestion: req.body.oneLineQuestion,
        describeQuestion: req.body.describeQuestion,
        slug: cleanedString,
        typeForQuestion: typeForQuestion,
        name: req.body.name,
        mobileNumber: req.body.mobileNumber,
      });

      res.status(200).json({
        status: true,
        message: "Your Query Was Posted Successfully",
        result: createdChat,
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  },

  addReply: async (req, res) => {
    try {
      const id = req.params.id;
      const communityChatId = req.body.communityChatId;
      const result = await communityChatModel.findByPk(id);
      const user = await userModel.findOne({ where: { id: id } });
      console.log(result, "resultttt");

      const name = user.firstName + " " + user.lastName;
      console.log(name);

      const payload = req.body.addReply;

      const createdReplies = await AddReply.create({
        userID: id,
        name: name,
        reply: req.body.reply,
        communityChatId: communityChatId,
      });

      const reply = await communityChatModel.increment("totalreplies", {
        by: 1,
        where: { id: communityChatId },
      });
      console.log(reply, " fghjkjh");

      res.status(200).json({
        status: true,
        message: "Successfully  message replies",
        result: createdReplies,
      });
    } catch (error) {
      res.status(400).json({
        status: false,
        message: "Something went wrong",
        error: error.message,
      });
    }
  },

  // addReply: async (req, res) => {
  //     try {
  //         const id = req.params.id;
  //         const result = await communityChatModel.findByPk(id);
  //         console.log(result, 'resultttt');

  //         if (result) {
  //             const payload = req.body.addReply;
  //             const createdReplies = await Promise.all(
  //                 payload.map(async (item) => {
  //                     return await AddReply.create({
  //                         name: item.name,
  //                         reply: item.reply,
  //                         communityChatId: result.id,
  //                     });
  //                 })
  //             );

  //             res.status(200).json({
  //                 status: true,
  //                 message: 'Successfully created message replies',
  //                 result: createdReplies,
  //             });
  //         } else {
  //             res.status(401).json({
  //                 status: false,
  //                 message: 'Question ID not found',
  //             });
  //         }
  //     } catch (error) {
  //         res.status(400).json({
  //             status: false,
  //             message: 'Something went wrong',
  //             error: error.message,
  //         });
  //     }
  // },

  getcommunities: async (req, res) => {
    try {
      // const communityChatId = req.query.communityChatId;
      // const totalreplies = await AddReply.count({ where: { communityChatId: communityChatId } });

      if (req.query.id) {
        communityChatModel
          .findOne({
            where: { id: req.query.id }, 
            include: {
              model: AddReply,
              as: "replies", 
            },
          })
          .then((result) => {
            if (result) {
              // Handle the query result here
              console.log(result);
              res.status(200).json({
                result: result,
                message: "Community data found",
              });
            } else {
              res.status(404).json({
                message: "Community not found",
              });
            }
          })
          .catch((error) => {
            console.error("Error:", error);
            res.status(500).json({
              status: false,
              message: "Internal server error",
              error: error,
            });
          });
      } else {
        communityChatModel
          .findAll({
            order: [["createdAt", "DESC"]], // Sort by 'createdAt' in descending order
          })
          .then((result) => {
            // Handle the query result here
            console.log(result);
            res.status(200).json({
              result: result,
              message: "all questions data ",
            });
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    } catch (err) {
      res.status(201).json({
        status: false,
        message: "something went wrong",
        error: err,
      });
    }
  },
};

module.exports = communityChatController;
