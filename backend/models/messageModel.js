const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    message: { type: String, trim: true },
    chatId: { type: mongoose.Schema.Types.ObjectId, ref: "chats" },
    isAllMessageDeleted: { type: Boolean, default: false, select: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("messages", messageSchema);
