const chatRoute = require("express").Router();

const { isAuthenticatedUser } = require("../middleware/authentication");
const {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroupChat,
  removeFromGroupChat,
  addToGroup,
  deleteAllChats
} = require("../controller/chatController");

chatRoute
  .route("/")
  .post(isAuthenticatedUser, accessChat)
  .get(isAuthenticatedUser, fetchChat);

chatRoute.route("/delete").post(isAuthenticatedUser, deleteAllChats);

chatRoute.route("/group").post(isAuthenticatedUser, createGroupChat);
chatRoute.route("/group/rename/:groupId").put(isAuthenticatedUser, renameGroupChat);
chatRoute.route("/group/add/:groupId").put(isAuthenticatedUser, addToGroup);
chatRoute.route("/group/remove/:groupId").put(isAuthenticatedUser, removeFromGroupChat);

module.exports = chatRoute;
