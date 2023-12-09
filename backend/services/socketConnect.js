const { Server } = require("socket.io");
const CLIENT_URL = process.env.CLIENT_URL;

module.exports = function connectSoacket(serverInfo) {
  //  Connect Socket io with client...
  const io = new Server(serverInfo, {
    pingTimeout: 60*1000,
    cors: {
      origin: CLIENT_URL,
    },
  });

  io.on("connection", (socket) => {
    // console.log("Connected with io.")

    let myInfo = {};

    //  Connect io with client...
    socket.on("setup", (userData) => {
      // console.log("userData: ",userData)
      myInfo = userData;
      socket.join(userData._id);
      socket.emit("connected");
    });

    // connect with chat...
    socket.on("joinChat", (chatId) => {
      // console.log('User joind ',chatId);
      socket.join(chatId);
    });

    //  on new message...
    socket.on("newMessage", (newMessageReceived) => {
      // console.log(myInfo)
      // console.log(newMessageReceived)
      var chat = newMessageReceived.chatId;
      if (!chat.users) return console.log("Chat.user is not defined.");

      //  don't show the message to sender only for other user's message will be visible...
      chat.users.forEach((userId) => {
        if (userId === newMessageReceived.sender._id) return;
        else socket.in(userId).emit("messageReceived", newMessageReceived);
      });
    });

    //  Typing...
    socket.on("typing", (chatId) => {
      // console.log("typing : ",chatId);
      socket.in(chatId).emit("typing");
    });
    socket.on("stopTyping", (chatId) => {
      // console.log("Stop typing : ",chatId);
      socket.in(chatId).emit("stopTyping");
    });

    socket.off("setup", (userData) => {
      // console.log('Disconnected : ',userData);
      socket.leave(userData._id);
    });
  });
};
