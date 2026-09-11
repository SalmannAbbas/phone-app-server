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
      socket.on('sendEmoji', (data) => {
    console.log('SEND EMOJI DATA:', data);

    const room = data.room;
    const emoji = data.emoji;

    console.log('ROOM:', room);
    console.log('EMOJI:', emoji);

    socket.to(room).emit('emojiReceived', {
      emoji: emoji,
    });
  });
  console.log('PHONE CONNECTED:', socket.id);

  socket.onAny((event, ...args) => {
    console.log('EVENT:', event, args);
  });

  socket.on('joinRoom', (roomCode) => {
    socket.join(roomCode);

    console.log(`${socket.id} joined room ${roomCode}`);

    socket.emit('roomJoined', roomCode);
  });



  socket.on('disconnect', (reason) => {
    console.log('PHONE DISCONNECTED:', socket.id, reason);
  });
});

server.listen(process.env.PORT || 5000, () => {
  console.log('SERVER RUNNING');
});