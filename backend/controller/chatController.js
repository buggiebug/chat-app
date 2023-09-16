const catchAsynError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const ObjHelper = require("../utils/helper");
const ChatModel = require("../models/chatModel");


//  Create new chat...
exports.createChat = catchAsynError(async (req, res, next) => {
  
});

//  Get all chats...
exports.AllChats = catchAsynError(async (req, res, next) => {
  const chats = await ChatModel.find({}).populate("users", "-password");
  return res.status(200).json({ success: true, chats });
});
