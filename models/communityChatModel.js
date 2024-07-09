const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../app/config/sequelize");
const userModel = require("../models/user");

const communityChatModel = sequelize.define("communitychat", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  oneLineQuestion: { type: DataTypes.STRING },
  describeQuestion: { type: DataTypes.TEXT },
  totalreplies: { type: DataTypes.INTEGER },
  slug: { type: DataTypes.STRING },
  typeForQuestion: { type: DataTypes.ARRAY(DataTypes.STRING) },
  name: { type: DataTypes.STRING },
  mobileNumber: { type: DataTypes.STRING },
});

const AddReply = sequelize.define("addreply", {
  id: {
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  name: { type: DataTypes.STRING },
  userID: {
    type: DataTypes.UUID,
  },
  reply: { type: DataTypes.TEXT },
  communityChatId: {
    type: DataTypes.UUID,
  },
});

// In your Sequelize model definition
communityChatModel.hasMany(AddReply, {
  foreignKey: "communityChatId",
  as: "replies",
});

userModel.hasMany(AddReply, {
  foreignKey: "userID",
  as: "replies",
});

module.exports = { communityChatModel, AddReply };
