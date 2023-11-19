const catchAsynError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const ObjHelper = require("../utils/helper");
const MessageModel = require("../models/messageModel");
const ChatModel = require("../models/chatModel");
const UserModel = require("../models/userModel");

//  New message...
exports.sendOneToOneMessage = catchAsynError(async (req, res, next) => {
  const { chatId, message } = req.body;
  const obj = new ObjHelper();
  if (!chatId || !message)
    return next(new ErrorHandler("Invalid request.", 400));
  if (!obj.isValidMongoId(chatId))
    return next(new ErrorHandler("Invalid I'd.", 400));

  const isChat = await ChatModel.findById(chatId);
  if (!isChat) return next(new ErrorHandler("Invalid I'd", 400));

  const newMessage = {
    sender: req.user._id,
    message,
    chatId,
  };
  try {
    let message = await MessageModel.create(newMessage);

    message = await message.populate("sender", "name email");
    message = await message.populate("chatId");

    message = await UserModel.populate(message, {
      path: "chatId.users",
      select: "name email",
    });

    await ChatModel.findByIdAndUpdate(chatId, { latestMessage: message });

    return res.status(200).json({ success: true, message });
  } catch (err) {
    return next(new ErrorHandler(err.message, 400));
  }
});

//  Get all messages...
exports.getAllMessages = catchAsynError(async (req, res, next) => {
  const { chatId } = req.params;
  const obj = new ObjHelper();
  if (!obj.isValidMongoId(chatId))
    return next(new ErrorHandler("Invalid I'd.", 400));

  try {
    let message = await MessageModel.find({
      $and: [{ chatId }, { isAllMessageDeleted: false }],
    })
      .populate("sender", "name email")
      .populate("chatId");

    // message = await UserModel.populate(message, {
    //     path: "chatId.users",
    //     select: "name email",
    // });

    return res.status(200).json({ success: true, message });
  } catch (err) {
    return next(new ErrorHandler(err.message, 400));
  }
});

//  Delete all messages from both side...
exports.deleteMessageForAllByChatId = catchAsynError(async (req, res, next) => {
  const { chatId } = req.params;
  const obj = new ObjHelper();
  if (!obj.isValidMongoId(chatId))
    return next(new ErrorHandler("Invalid I'd.", 400));

  try {
    const totalMessages = await MessageModel.find({$and:[{chatId},{isAllMessageDeleted:false}]}).countDocuments();
    await MessageModel.updateMany({
      $and: [{ chatId }, { isAllMessageDeleted: false }],
    },{isAllMessageDeleted:true});
    return res.status(200).json({ success: true, message: `${totalMessages}, messages are deleted.` });
  } catch (err) {
    return next(new ErrorHandler(err.message, 400));
  }
});
