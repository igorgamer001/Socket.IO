// Import required modules
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const app = express();
const PORT = 3000;

// Create an HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server);

// Serve a simple HTML page for chat
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Real-Time Chat</title>
      <style>
        body { font-family: Arial, sans-serif; }
        #messages { height: 300px; overflow-y: scroll; border: 1px solid #ccc; padding: 10px; }
      </style>
    </head>
    <body>
      <h1>Real-Time Chat</h1>
      <div id="messages"></div>
      <input id="messageInput" type="text" placeholder="Type your message..." />
      <button id="sendButton">Send</button>
      <script src="/socket.io/socket.io.js"></script>
      <script>
        const socket = io();
        const messagesDiv = document.getElementById('messages');
        const messageInput = document.getElementById('messageInput');
        const sendButton = document.getElementById('sendButton');

        socket.on('message', (msg) => {
          const messageElement = document.createElement('div');
          messageElement.textContent = msg;
          messagesDiv.appendChild(messageElement);
          messagesDiv.scrollTop = messagesDiv.scrollHeight;
        });

        sendButton.addEventListener('click', () => {
          const message = messageInput.value;
          if (message) {
            socket.emit('message', message);
            messageInput.value = '';
          }
        });

        messageInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') sendButton.click();
        });
      </script>
    </body>
    </html>
  `);
});

// Handle socket connection and messaging
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('message', (msg) => {
    console.log(`Message from ${socket.id}: ${msg}`);
    io.emit('message', `${socket.id}: ${msg}`);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
    io.emit('message', `${socket.id} has left the chat`);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
