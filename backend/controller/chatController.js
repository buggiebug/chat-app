const catchAsynError = require("../middleware/catchAsyncError");
const ErrorHandler = require("../utils/errorHandler");
const ObjHelper = require("../utils/helper");
const ChatModel = require("../models/chatModel");
const UserModel = require("../models/userModel");
const path = require("path");
const fs = require("fs");


//  Get file...
const getFile = async(fileName)=>{
  const profilePath = await path.join(__dirname,"../uploads", String(fileName));  
  if(String(profilePath.split("\\").at(profilePath.split("\\").length-1)) !== "{}" && fileName !== null && String(profilePath.split("\\").at(profilePath.split("\\").length-1)) !== " "){
    const profileData = (await fs.promises.readFile(profilePath)).toString("base64");
    return profileData;
  }else{
    return " ";
  }
}

const updatedChat = async(chats)=>{
  const chitchat = [...chats];
  await Promise.all(
    chitchat.map(async(chat,ind_1)=>{
      return await Promise.all(
         chat.users?.map(async(user,ind_2)=>{
          return user.profilePicture = await getFile(user.profilePicture);
        })
      )
    })
  )
  return chitchat;
}


//  Create new chat...
exports.accessChat = catchAsynError(async (req, res, next) => {
  const helper = new ObjHelper();
  const { userId } = req.body;
  // console.log(userId);
  if (!helper.isValidMongoId(userId))
    return next(new ErrorHandler("Invalid I'd.", 400));

  let isChat = await ChatModel.find({
    isGroupChat: false,
    $and: [
      {
        users: { $elemMatch: { $eq: req.user._id } },
        users: { $elemMatch: { $eq: userId } },
      },
    ],
  })
    .populate({ path: "users", select: "name email" })
    .populate("latestMessage");

  // .populate("users", "-password -profilePicture")
  // isChat = await UserModel.populate(isChat, {
  //   path: "latestMessage.sender",
  //   select: "name email",
  // });

  if (isChat.length > 0) {
    return res.status(200).json({ success: true, isChat: isChat });
  } else {
    try {
      const chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
      const createChat = await ChatModel.create(chatData);
      await createChat.save({ validateModifiedOnly: true });
      const isChat = await ChatModel.findOne({
        _id: createChat._id,
      }).populate({ path: "users", select: "name email" });
      return res.status(200).json({ success: true, isChat });
    } catch (err) {
      return next(new ErrorHandler(err.message, 400));
    }
  }
});

//  Get all chats...
exports.fetchChat = catchAsynError(async (req, res, next) => {
  try {
    const chats = await ChatModel.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "name email profilePicture")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });
  
    const resData = await updatedChat(chats);  
    return res.status(200).json({ success: true, chats:resData });
  } catch (err) {
    return next(new ErrorHandler(err.message, 400));
  }
});

//  Create group chat...
exports.createGroupChat = catchAsynError(async (req, res, next) => {
  const { groupUsers, groupName } = req.body;

  const users = JSON.parse(groupUsers);

  if (!users || !groupName)
    return next(new ErrorHandler("Groupname & Users are required.", 400));
  if (users.length < 2)
    return next(
      new ErrorHandler("Group will required more than 2 users.", 401)
    );
  if (String(groupName).length < 3)
    return next(
      new ErrorHandler("Group name must be greater than 3 char.", 401)
    );

  await users.push(req.user);

  try {
    const createdGroup = await ChatModel.create({
      chatName: groupName,
      users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    await createdGroup.save({ validateModifiedOnly: true });
    const group = await ChatModel.findById(createdGroup._id)
      .populate({ path: "users", select: "name email" })
      .populate("latestMessage")
      .populate({ path: "groupAdmin", select: "name email" });
    return res.status(200).json({
      success: true,
      message: `New group created ${groupName}`,
      group,
    });
  } catch (err) {
    return next(new ErrorHandler(err.message, 400));
  }
});

//  Rename group chat...
exports.renameGroupChat = catchAsynError(async (req, res, next) => {
  const { groupId } = req.params;
  const { groupName } = req.body;
  const helper = new ObjHelper();
  if (!helper.isValidMongoId(groupId))
    return next(new ErrorHandler("Invalid I'd.", 400));
  if (String(groupName).length < 3)
    return next(
      new ErrorHandler("Group name must be greater than 3 char.", 401)
    );

  try {
    const group = await ChatModel.findOneAndUpdate(
      { $and: [{ _id: groupId }, { isGroupChat: true }] },
      { chatName: groupName },
      { new: true }
    )
      .populate({ path: "users", select: "name email" })
      .populate("latestMessage")
      .populate({ path: "groupAdmin", select: "name email" });
    if (!group) return next(new ErrorHandler("Group not found.", 401));
    else
      return res.status(200).json({
        success: true,
        message: `Group name changed to ${groupName}`,
        group,
      });
  } catch (err) {
    return next(new ErrorHandler(err.message, 400));
  }
});

//  Add to group chat...
exports.addToGroup = catchAsynError(async (req, res, next) => {
  const { groupId } = req.params;
  const { userId } = req.body;
  const helper = new ObjHelper();
  if (!helper.isValidMongoId(groupId) && !helper.isValidMongoId(userId))
    return next(new ErrorHandler("Invalid I'd.", 400));
  try {
    const isUserExist = await ChatModel.findOne({
      $and: [
        { _id: groupId },
        {
          $and: [
            { isGroupChat: true },
            { users: { $elemMatch: { $eq: userId } } },
          ],
        },
      ],
    });
    if (isUserExist) return next(new ErrorHandler("Already joined.", 401));
    const group = await ChatModel.findOneAndUpdate(
      { $and: [{ _id: groupId }, { isGroupChat: true }] },
      { $push: { users: userId } },
      { new: true }
    )
      .populate({ path: "users", select: "name email" })
      .populate("latestMessage")
      .populate({ path: "groupAdmin", select: "name email" });
    return res.status(200).json({ success: true, group });
  } catch (err) {
    return next(new ErrorHandler(err.message, 400));
  }
});

//  Remove from group chat...
exports.removeFromGroupChat = catchAsynError(async (req, res, next) => {
  const { groupId } = req.params;
  const { userId } = req.body;
  const helper = new ObjHelper();
  if (!helper.isValidMongoId(groupId) && !helper.isValidMongoId(userId))
    return next(new ErrorHandler("Invalid I'd.", 400));
  try {
    const group = await ChatModel.findOneAndUpdate(
      { $and: [{ _id: groupId }, { isGroupChat: true }] },
      { $pull: { users: userId } },
      { new: true }
    )
      .populate({ path: "users", select: "name email" })
      .populate("latestMessage")
      .populate({ path: "groupAdmin", select: "name email" });
    if (!group) return next(new ErrorHandler("Group not found.", 401));
    else return res.status(200).json({ success: true, group });
  } catch (err) {
    return next(new ErrorHandler(err.message, 400));
  }
});

//  Delete all chats...
exports.deleteAllChats = catchAsynError(async (req, res, next) => {
  const { chatIds } = req.body;
  const helper = new ObjHelper();
  try {
    if (!(chatIds.length > 0))
      return next(new ErrorHandler("No chat founds.", 401));
    if (
      chatIds
        .map((e) => {
          return helper.isValidMongoId(e) === true ? true : false;
        })
        .includes(false)
    )
      return next(new ErrorHandler("Invalid I'd.", 400));
    else {
      await ChatModel.deleteMany({ _id: { $in: chatIds } });
      const remainingChats = await ChatModel.find({
        users: { $elemMatch: { $eq: req.user._id } },
      })
        .populate("users", "name email")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });
      return res.status(200).json({
        success: true,
        chats: remainingChats,
        message: "Chats are deleted.",
      });
    }
  } catch (err) {
    return next(new ErrorHandler(err.message, 400));
  }
});
