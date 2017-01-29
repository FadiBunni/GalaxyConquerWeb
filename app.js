const express = require('express');
const app     = express();
const http    = require('http').Server(app);
const io      = require('socket.io')(http);
const path    = require('path');

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/client/index.html');
});

app.use('/client', express.static(path.join(__dirname + '/client')));

const port = process.env.PORT || 2000;
http.listen(port,function(){
	console.log('Server started: http://localhost:2000/');
});

var SETTINGS = require('./server/js/utils/SETTINGS.js');
var lobbyManager = new (require('./server/js/gamestate/lobbymanager.js'))(io);
var roomManager  = new (require('./server/js/gamestate/roommanager.js'))(io);
var gameManager  = new (require('./server/js/gamestate/gamemanager.js'))(io, roomManager);

io.on('connection', function(socket){
	console.log('user connected: ', socket.id);
    io.to(socket.id).emit('connected', SETTINGS.CLIENT_SETTINGS);
    //Send data to all the sockets beside the emitting socket it self
    socket.broadcast.emit('new user entered');
    //Update total user count
    io.emit('total user count updated', socket.server.eio.clientsCount);

    //Push socket to lobby and delete them form lobby when they are ready
    socket.on('waiting', function(){
        console.log('waiting from ' + socket.id);
        lobbyManager.push(socket);
        lobbyManager.dispatch(roomManager);
    });
});

