const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();

app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('A phone connected:', socket.id);

  socket.on('joinRoom', (roomCode) => {
    socket.join(roomCode);

    console.log(`${socket.id} joined room ${roomCode}`);

    socket.emit('roomJoined', roomCode);
  });

  socket.on('sendEmoji', (roomCode) => {
    console.log(`Emoji sent in room ${roomCode}`);

    socket.to(roomCode).emit('emojiReceived', '😂');
  });

  socket.on('disconnect', () => {
    console.log('A phone disconnected:', socket.id);
  });
});

server.listen(process.env.PORT || 5000, () => {
  console.log('Server running on port 5000');
});