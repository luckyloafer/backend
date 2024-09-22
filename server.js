const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
      },
      transports: ['websocket', 'polling'],  // Ensure both WebSocket and polling are supported
      allowEIO3: true 
});

// Socket.io connection
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('message', (message) => {
        console.log('Message received:', message);
        io.emit('message', message); // Broadcast the message to all clients
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// Basic route for testing
app.get('/', (req, res) => {
    res.send('Socket.io Server is running');
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
