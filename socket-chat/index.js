const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express()
const server = http.createServer(app);

app.use(cors());

const io = new Server(server, {
    cors: {
        origin: "https://chat-app-h9ca.onrender.com",
        methods: ["GET", "POST"]
    }
});

app.set('view engine', 'ejs');
app.set('views', './views');

app.get('/', (req, res) => {
  res.render('index')
});

io.on('connection', (socket) => {
    console.log("User connected:", socket.id);

    socket.on('join', (username) => {
        console.log(`${username} joined the chat.`);
        socket.username = username; // Store the username in the socket object for later use
        io.emit('user_joined', `${username} has joined the chat.`); // Notify all clients that a new user has joined
    })

    socket.on('send_message', (message) => {
        console.log(`Message from ${socket.username}: ${message}`);
        io.emit('new_message', { username: socket.username, message }); // Broadcast the message to all clients
    })

    socket.on('disconnect', () => {
        console.log("User disconnected:", socket.id);
        if (socket.username) {
            io.emit('user_left', `${socket.username} has left the chat.`); // Notify all clients that a user has left
        }
    })
})

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});