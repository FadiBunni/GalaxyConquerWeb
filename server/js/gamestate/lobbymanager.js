function LobbyManager(io){
	var LbMg = this;
	LbMg.lobby = [];
	LbMg.updating = false;

	//Push the connected socket to the array
	LbMg.push = function(socket){
		//if the element does not exist in the array add one.
		if(LbMg.lobby.indexOf(socket) < 0){
			console.log('lobbyin: ' + socket.id);
			LbMg.lobby.push(socket);
		}
	};

	//Delete the connected sockets/players in the array, when they disconnect
	LbMg.kick = function(socket) {
		var index = LbMg.lobby.indexOf(socket);
		if(index >= 0 ){
			LbMg.lobby.splice(index, 1);
		}
	};

	//When 2 or more players is in the lobby, create a room for 2 players to play in
	LbMg.dispatch = function(RmMg){
		//first time loading the method, dispatching is undefinded!!
		if(LbMg.dispatching) return;
		LbMg.dispatching = true;

		/*When the lobby reaches 2 or more players and the are ready, create a new room,
		add 2 players to the room,
		and delete these 2 players from the lobby list.*/
		while(LbMg.lobby.length > 1) {
			var player0 = LbMg.lobby.splice(0,1);
			var player1 = LbMg.lobby.splice(0,1);
			//Create a room with 2 players
			RmMg.create(player0[0],player1[0]);
			//console.log("lobbyout: "+player0[0].id);
      		//console.log("lobbyout: "+player1[0].id);
     		//console.log("lobbyout.length: "+LbMg.lobby.length);
		}
		LbMg.dispatching = false;
	};
}

module.exports = LobbyManager;