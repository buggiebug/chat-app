require("dotenv").config({ path: "./config.env" });
// Uncaught Exception Error [It will throw an error when it finds anything undefined & Shutdown the server] ...
process.on("uncaughtException", (e) => {
  console.info(`Error : ${e.message} \nShutting down the server...`);
  process.exit(1);
});


//  ENV Files...
const PORT = process.env.PORT;
const HOST = process.env.HOST;
const DB_URL = process.env.DB_URL;
const CLIENT_URL = process.env.CLIENT_URL;

const express = require("express");
const morgan = require('morgan')

const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const socketConnect = require("./services/socketConnect");
app.use(express.json());

app.use(
  cors({
    credentials: true,
    maxAge: Date.now() + 24 * 60 * 60 * 1000,
    origin: CLIENT_URL,
  })
);
app.use(cookieParser());
app.use(morgan(':url :method :status :req[header] :res[header]'));

//  Connect with Database...
const dbConnect = require("./database/dbConnect");
dbConnect(DB_URL);

// Routes...
app.get("/", (req, res) => {
  return res
    .status(200)
    .json({ success: true, message: "Welcome to Chat App API." });
});

// Users...
app.use("/api", require("./routes/userRoutes"));
app.use("/api/chats", require("./routes/chatRoutes"));
app.use("/api/chat/message", require("./routes/messageRoutes"));

const server = app.listen(PORT, () => {
  console.log(`server running at http://${HOST}:${PORT}`);
});

//  connect Socket...
socketConnect(server);

//  Errors...
app.use(require("./middleware/errors"));

// Unhandle Rejection Error [It will throw an error& Shutdown the server] ...
process.on("unhandledRejection", (e) => {
  console.info(`${e}\n\nShutting down the server...`);
  process.exit(1);
});
