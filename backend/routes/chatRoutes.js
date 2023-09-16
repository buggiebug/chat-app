const chatRoute = require("express").Router();

const { isAuthenticatedUser } = require("../middleware/authentication");
const {AllChats} = require("../controller/chatController");


chatRoute.route("/all-chats").get(isAuthenticatedUser,AllChats);



module.exports = chatRoute;
