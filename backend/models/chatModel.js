const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    isGroupChat: { type: Boolean, default: false },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "messages",
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    // groupAdminAll: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "users",
    //   },
    // ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("chats", chatSchema);
