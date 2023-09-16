const messageRoute = require("express").Router();

const { isAuthenticatedUser } = require("../middleware/authentication");
const {} = require("../controller/chatController");


module.exports = messageRoute;
