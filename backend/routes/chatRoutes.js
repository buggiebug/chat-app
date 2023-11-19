const chatRoute = require("express").Router();

const { isAuthenticatedUser } = require("../middleware/authentication");
const {
  createOneToOneChat,
  fetchAllChat,
  createGroupChat,
  renameGroupChat,
  removeFromGroupChat,
  addToGroupChat,
  deleteAllChats
} = require("../controller/chatController");

chatRoute
  .route("/")
  .post(isAuthenticatedUser, createOneToOneChat)
  .get(isAuthenticatedUser, fetchAllChat);

chatRoute.route("/delete").post(isAuthenticatedUser, deleteAllChats);

chatRoute.route("/group").post(isAuthenticatedUser, createGroupChat);
chatRoute.route("/group/rename/:groupId").put(isAuthenticatedUser, renameGroupChat);
chatRoute.route("/group/add/:groupId").put(isAuthenticatedUser, addToGroupChat);
chatRoute.route("/group/remove/:groupId").put(isAuthenticatedUser, removeFromGroupChat);

module.exports = chatRoute;
