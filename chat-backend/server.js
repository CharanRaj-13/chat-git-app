const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());

let users = {}; // { userId: username }

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle joining a room
  socket.on("join_room", ({ room, username }) => {
    users[socket.id] = username;
    socket.join(room);
    io.to(room).emit("user_joined", { username });
    console.log("UserJoined : ",username);
  });

  // Handle sending messages
  socket.on("send_message", ({ room, username, message }) => {
    const timestamp = new Date().toLocaleTimeString();
    const messageData = { username, message, timestamp, status: "Sent" };

    io.to(room).emit("receive_message", messageData);
    console.log(messageData);
  });

  // Handle deleting messages
  socket.on("delete_message", ({ room, messageIndex }) => {
    io.to(room).emit("remove_message", messageIndex);
  });
});

server.listen(5000, () => {
  console.log("Server is running on port 5000");
});
