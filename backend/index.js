require("dotenv").config({ path: "./config.env" });

const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    maxAge: Date.now() + 24 * 60 * 60 * 1000,
    origin: "http://localhost:3000",
  })
);
app.use(cookieParser());

//  ENV Files...
const PORT = process.env.PORT;
const HOST = process.env.HOST;
const DB_URL = process.env.DB_URL;

// Uncaught Exception Error [It will throw an error when it finds anything undefined & Shutdown the server] ...
process.on("uncaughtException", (e) => {
  console.info(`Error : ${e.message} \nShutting down the server...`);
  process.exit(1);
});

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

app.listen(PORT, () => {
  console.log(`server running at http://${HOST}:${PORT}`);
});

//  Errors...
app.use(require("./middleware/errors"));

// Unhandle Rejection Error [It will throw an error& Shutdown the server] ...
process.on("unhandledRejection", (e) => {
  console.info(`${e}\n\nShutting down the server...`);
  process.exit(1);
});
