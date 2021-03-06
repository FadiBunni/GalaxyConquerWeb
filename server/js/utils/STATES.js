const Countdown = require('./countdown.js');
const SETTINGS = require('./SETTINGS.js');

var statuses = [];
var isSet = false;
var issSet = true;
var createdAt;
var number = 1;

var ready = {
	initialize: function(io,room){
		this.io = io;
		room.status = "ready";
		//Set the loop in the room "class" equal to the loop in ready object
		//Add countdown to the room.object array and instantiate a new one

		var statuses = getAllStatsFromPlanets(room);
		//console.log(statuses);
		io.to(room.id).emit('init', statuses);

		room.countDownObject.countdown = new Countdown(30,null,SETTINGS.HEIGHT/2-100,null,true);
    	room.countDownObject.countdown.action = function(room){
   //  		Destroy can be called because RmMg is inside the room contructor.
			// Calling the destroy function in RmMg not in this 'ready' variable
     		delete room.countDownObject.countdown;
      		room.RmMg.destroy(room.id);
    	};
    	room.loop = this.loop;
	},

	loop: function(room){
		var player0ready = room.planets[room.players[0].id].ready;
		var player1ready = room.planets[room.players[1].id].ready;
		// if both players is ready, destroy the room, and initialize the game(playing)
		if(player0ready && player1ready) {
			playing.initialize(ready.io,room);
		}
		var statuses = getCountdownMessage(room);
		//console.log(statuses);
		ready.io.to(room.id).emit('update', statuses);
		//get statuses from all the objects in the room array, and send it to client
		/*You can return the data, so it can be consoled.log in room class
		within the room.runLoop method.*/
		//return statuses;
	}
};

var playing = {
	initialize: function(io,room){
		this.io = io;
		this.room=room;
		room.status = "countdown";
		//Set the loop in the room "class" equal to the loop in ready object

		room.countDownObject.countdown = new Countdown(1,null,SETTINGS.HEIGHT/2-100,null,true);
    	room.countDownObject.countdown.action = function(room){
      		delete room.countDownObject.countdown;
      		room.status = "playing";
   		};

   		/*Since ready.io is the parameter for playing.initialize
   		We dont need to write playing.io... */
   		room.loop = this.preloop;
	},

	preloop: function(room){
		if(room.countDownObject.countdown.status.count.message !== 0){
			var statuses = getCountdownMessage(room);
			if(statuses[0].message <= 0){
				playing.io.to(room.id).emit('playing');
				isSet = true;
				playing.room.loop = playing.loop;

			}
			playing.io.to(room.id).emit('update', statuses);
		}
	},

	loop: function(room){
		if(isSet){
			createdAt = Date.now();
			isSet = false;
		}
		var statuses = getAllStatsFromPlanetsUpdate(room,createdAt);
		//console.log(statuses);
		playing.io.to(room.id).emit('update', statuses);

		if(issSet){
			spawnShips(room);
			issSet = false;
		}

		var statuses = getAllStatsFromShips(room);
		playing.io.to(room.id).emit('update', statuses);

		//get statuses from all the objects in the room array, and send it to client
		// if(room.status == "playing" && (room.planets[room.players[0].id].score>=SETTINGS.GOAL || room.planets[room.players[1].id].score>=SETTINGS.GOAL)){
		// 	room.status = "gameOver";
		// } else if(room.status == "gameOver"){
		// 	if(room.planets[room.players[0].id].score>room.planets[room.players[1].id].score){
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

//the problem with this function is that is sends all the same data again, even though the grayzoneplanets does not move.
function getAllStatsFromPlanets(room){
	statuses = [];
	//Object is all the objects in the object array in room "class".
	for(var object in room.planets){
		//console.log("object: " + object);
		//Get the specific class/entity.
		var obj = room.planets[object];
		//console.log("obj: " + obj.status);
		statuses.push(obj.status.planet);
		//console.log("obj.status: " + obj);
	}
	//console.log(statuses);
	return statuses;
}

function getCountdownMessage(room){
	statuses = [];
	//Object is all the objects in the object array in room "class".
	for(object in room.countDownObject){
		var obj = room.countDownObject[object];
		if(obj.status.count){
			if(room.countDownObject.countdown){
				room.countDownObject.countdown.update(room);
				//console.log(obj.status.count);
				statuses.push(obj.status.count);
			}
		}
	}
	//console.log(statuses);
	return statuses;
}

function getAllStatsFromPlanetsUpdate(room,createdAt){
	statuses = [];
	//Object is all the objects in the object array in room "class".
	for(var object in room.planets){
		//console.log("object: " + object);
		//Get the specific class/entity.
		var obj = room.planets[object];
		//console.log("obj: " + obj.status);
		//Update all the classes with an update method and push all statuses in every object.
		obj.update(room,createdAt);
		if(obj.status.planet){
			//console.log(obj.status.planet);
			statuses.push(obj.status.planet);
		}
	}
	//console.log(statuses);
	return statuses;
}

function spawnShips(room){
	//Object is all the objects in the object array in room "class".
	for(var object in room.planets){
		//Get the specific class/entity.
		var obj = room.planets[object];
		if(obj.spawnShips){
			obj.spawnShips();
		}
	}
}

function getAllStatsFromShips(room){
	for(var object in room.planets){
		//Get the specific class/entity.
		var obj = room.planets[object];
		if(obj.spawnShips){
			//get the ships array inside the given planets and push them in the statuses array
			for(var ship in obj.ships){
				var ship = obj.ships[ship];
				ship.update(room);
				statuses.push(ship.status.ship);
				//console.log(ship.status.ship);
			}
			return statuses;
		}
	}
}