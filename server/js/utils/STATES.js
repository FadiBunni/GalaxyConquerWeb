//const Countdown = require('./countdown.js');
const SETTINGS = require('./SETTINGS.js');

var ready = {
	initialize: function(io,room){
		this.io = io;
		room.status = "ready";
		//Set the loop in the room "class" equal to the loop in ready object
		room.loop = this.loop;
		//Add countdown to the room.object array and instantiate a new one
		//room.objects.countdown = new Countdown(10,null,SETTINGS.HEIGHT-40);
    	//room.objects.countdown.action = function(room){
    		/*Destroy can be called because RmMg is inside the room contructor.
			Calling the destroy function in RmMg not in this 'ready' variable*/
     // 		delete room.objects.countdown;
     //  		room.RmMg.destroy(room.id);
    	// };
	},

	loop: function(room){
		// var player0ready = room.objects[room.players[0].id].ready;
		// var player1ready = room.objects[room.players[1].id].ready;
		//if both players is ready, destroy the room, and initialize the game(playing)
		// if(player0ready && player1ready) {
		// 	playing.initialize(ready.io,room);
		// }
		//get statuses from all the objects in the room array, and send it to client
		var statuses = getStatsFromObejcts(room);
		ready.io.to(room.id).emit('update', statuses);
		/*You can return the data, so it can be consoled.log in room class
		within the room.runLoop method.*/
		//return statuses;
	}
};

var playing = {
	initialize: function(io,room){
		this.io = io;
		room.status = "countdown";
		//Set the loop in the room "class" equal to the loop in ready object
		room.loop = this.loop;
		// room.objects.countdown = new Countdown(3,null,SETTINGS.HEIGHT*3/4,100);
  //   	room.objects.countdown.action = function(room){
  //     		delete room.objects.countdown;
  //     		room.status = "playing";
  //  		};
   		/*Since ready.io is the parameter for playing.initialize
   		We dont need to write playing.io... */
    	io.to(room.id).emit('playing');
	},

	loop: function(room){
		//get statuses from all the objects in the room array, and send it to client
		var statuses = getStatsFromObejcts(room);
		playing.io.to(room.id).emit('update', statuses);
		// if(room.status == "playing" && (room.objects[room.players[0].id].score>=SETTINGS.GOAL || room.objects[room.players[1].id].score>=SETTINGS.GOAL)){
		// 	room.status = "gameOver";
		// } else if(room.status == "gameOver"){
		// 	if(room.objects[room.players[0].id].score>room.objects[room.players[1].id].score){
  //       		room.RmMg.gameOver(room.id,room.players[0].id);
  //     		} else {
  //       		room.RmMg.gameOver(room.id,room.players[1].id);
		// 	}
		// }
		/*You can return the data, so it can be consoled.log in room class
		within the room.runLoop method.*/
		//return statuses;
	}
};
module.exports = {ready,playing};

function getStatsFromObejcts(room){
	var statuses = [];
	//Object is all the objects in the object array in room "class".
	for(var object in room.objects){
		//console.log("object: " + object);
		//Get the specifik class/entity.
		var obj = room.objects[object];
		//console.log("obj: " + obj);
		//Update all the classes with an update method and push all statuses in every object.
		obj.update(room);
		statuses.push(obj.status);
		//console.log("obj.status: " + obj.status);
	}
	return statuses;
}