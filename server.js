const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket", "polling"], // Ensure both WebSocket and polling are supported
  allowEIO3: true,
});

// Socket.io connection
const onlineUsers = new Set();
// io.on("connection", (socket) => {
//   console.log("A user connected");
//   socket.on("registerUser", (userId) => {
//     onlineUsers.add(userId); // Add the userId to the Set
//     io.emit("onlineUsers", onlineUsers.size); // Emit the unique user count to all clients
//   });
//   socket.on("message", (message) => {
//     console.log("Message received:", message);
//     io.emit("message", message); // Broadcast the message to all clients
//   });

//   socket.on("disconnect", () => {
//     io.emit('onlineUsers', onlineUsers.size);
//   });
// });

io.on("connection", (socket) => {
    console.log("A user connected", socket.id);
  
    socket.on("registerUser", (userId) => {
      // You could store the mapping of socket.id to userId in an object
      onlineUsers.add(socket.id); // Add socket id to track the connection
      io.emit("onlineUsers", onlineUsers.size); // Emit updated online user count
    });

    socket.on("disconnect", () => {
      onlineUsers.delete(socket.id); // Remove user based on socket id
      io.emit("onlineUsers", onlineUsers.size); // Emit updated user count
    });

       socket.on("message", (message) => {
    console.log("Message received:", message);
     io.emit("message", message); // Broadcast the message to all clients
   });
  });

// Basic route for testing
app.get("/", (req, res) => {
  res.send("Socket.io Server is running");
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
