const INTERVAL = 1000;

function GameManager(io, roomManager){
  var GmMg = this;
  GmMg.RmMg = roomManager;

  //Trigger this function every 1/100 of seconds - set by INTERVAL.
  GmMg.update = setInterval(function(){
  	//loop through every rooms and get the roomId
    for(var roomId in GmMg.RmMg.rooms){
    	//Get the spcific room
      	var room = GmMg.RmMg.rooms[roomId];
      	//Get the runLoop method in the room class, and set room as parameter
        room.runLoop(room);
    }
  },INTERVAL);
}

module.exports = GameManager;