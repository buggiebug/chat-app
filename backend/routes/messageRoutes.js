const messageRoute = require("express").Router();

const { isAuthenticatedUser } = require("../middleware/authentication");
const {
  sendOneToOneMessage,
  getAllMessages,
  deleteMessageForAllByChatId,
} = require("../controller/messageController");

messageRoute.route("/send").post(isAuthenticatedUser, sendOneToOneMessage);
messageRoute
  .route("/:chatId")
  .get(isAuthenticatedUser, getAllMessages)
  .delete(isAuthenticatedUser, deleteMessageForAllByChatId);

module.exports = messageRoute;
