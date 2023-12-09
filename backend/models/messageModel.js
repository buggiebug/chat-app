const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    message: { type: String, trim: true },
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "chats" },
    isSendOnBlockedTime: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      select: false,
    },
    isDeleted: { type: Boolean, default: false, select: false },
    isAllMessageDeleted: { type: Boolean, default: false, select: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("messages", messageSchema);
