const { Server } = require("socket.io");
const CLIENT_URL = process.env.CLIENT_URL;

module.exports = function connectSoacket(server) {
  //  Connect Socket io with client...
  const io = new Server(server, {
    pingTimeout: 60*1000,
    cors: {
      origin: CLIENT_URL,
    },
  });

  io.on("connection", (socket) => {
    // console.log("Connected with io.")

    //  Connect io with client...
    socket.on("setup", (userData) => {
      socket.join(userData._id);
      socket.emit("connected");
      // console.log(userData)
    });

    // connect with chat...
    socket.on("joinChat", (chatId) => {
      // console.log('User joind ',chatId);
      socket.join(chatId);
    });

    //  on new message...
    socket.on("newMessage", (newMessageReceived) => {
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
