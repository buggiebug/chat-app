const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    message: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "chats" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("messages", messageSchema);


