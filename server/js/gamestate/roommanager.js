const STATES = require('../utils/STATES.js');
const SETTINGS = require('../utils/SETTINGS.js');
const Room = require('./room.js');


function RoomManager(io){
	var RmMg = this;
	RmMg.rooms = {};
	RmMg.roomIndex = {};

	/*Create a new room and add it to the rooms array and
	add the players to the room and to the roomIndex array */
	RmMg.create = function(player0, player1){
		//Player0 and player1 is actually the socket, roomId is the sum of both.
		var roomId = player0.id+player1.id;
		//Create new room
		var room = new Room(RmMg, io, roomId, player0, player1);
		//Add the players to the new room
		player0.join(roomId);
		player1.join(roomId);
		//Add to array and set them equal to room and roomId
		RmMg.rooms[roomId] = room;
		RmMg.roomIndex[player0.id] = roomId;
		RmMg.roomIndex[player1.id] = roomId;

		STATES.ready.initialize(io, room);
		// //Emit to players that they are ready, and their side on the map
		io.to(player0.id).emit('ready');
		io.to(player1.id).emit('ready');
		console.log('Room Created: ', roomId);

	};

	//Delete the players form array and destory the room
	RmMg.destroy = function(roomId){
		//Find the room with the specific roomId and set it to room variable
		var room = RmMg.rooms[roomId];
		/*Loop through all players if they are not ready and if the timer has not finished
		delete player by their socket.id in the roomIndex and and emit to socketid a message */
		room.players.forEach(function(socket){
			var message = (!room.objects[socket.id].ready && !room.objects.countdown) ? "You are were not prepared": null ;
			delete RmMg.roomIndex[socket.id];
			io.to(socket.id).emit('destroy', message);
		});
		//Destroy the room
		delete RmMg.rooms[roomId];
	};

	//Same as RmMg.destroy, but only after a winner is found, also message is different...
	RmMg.gameOver = function(roomId, winner){
		var room = RmMg.rooms[roomId];
		room.players.forEach(function(socket){
			var message = (socket.id == winner) ? "You win!" : "You lose!";
			delete RmMg.roomIndex[socket.id];
			io.to(socket.id).emit('destroy', message);
		});
		delete RmMg.rooms[roomId];

	};
}
module.exports = RoomManager;