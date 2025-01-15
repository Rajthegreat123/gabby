const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

let players = [];

app.use(express.static('public'));  // Serve static files

io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Add new player to the game
    players.push(socket);
    if (players.length === 2) {
        io.emit('start_game');  // Notify both players to start the game
    }

    socket.on('make_move', (data) => {
        // Send the move to the other player
        socket.broadcast.emit('opponent_move', data);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
        players = players.filter(player => player !== socket);
    });
});

server.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
