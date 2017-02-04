var grayzonePlanets = require('../entities/grayzonePlanets.js');

function Room (RmMg, io, id, player0, player1){
	var amoutOfGrayzonePlanet = 20;
	var planetDistance = 15;
	var Rm = this;
	Rm.RmMg = RmMg;
	Rm.id = id;
	Rm.players = [player0,player1];
	Rm.objects = {};

	//Spawns grayzoneplanets with window collision and planet collision, see the functions below and in grayzonePlanets class.
	spawnGrayzonePlanets(Rm,amoutOfGrayzonePlanet,grayzonePlanets, planetDistance);
	// console.log(Rm.objects[0]);
	// console.log(Rm.objects[1]);
	// console.log(Object.keys(Rm.objects).length);


	/*Add to object player.id(socket.id) as a new player form the player class.
	Also add other stuff in the object array.*/

	// Rm.objects[Rm.players[0].id] = new Player(Rm.players[0].id, "LEFT");
	// Rm.objects[Rm.players[1].id] = new Player(Rm.players[1].id, "RIGHT");
	// Rm.objects.player0Score = new Score(Rm.players[0].id, "LEFT");
	// Rm.objects.player1Score = new Score(Rm.players[1].id, "RIGHT");
	// Rm.objects.ball = new Ball(Rm.players[0].id, Rm.players[1].id);

	//The room.loop is set in STATES.js!!!!!!!!
	Rm.runLoop = function(room) {
		//Too console.log the objects info, you need to return the data in STATES.js, see loop.
		// console.log("All objects: ");
		// console.log(room.loop(room));
		room.loop(room);
		//room.playSounds();
	};
}
module.exports = Room;

function spawnGrayzonePlanets(Rm,amoutOfGrayzonePlanet,grayzonePlanets, planetDistance){

	while(Object.keys(Rm.objects).length < amoutOfGrayzonePlanet){
		var currentGrayzonePlanet = new grayzonePlanets(Object.keys(Rm.objects).length);
		//console.log("currentPlanet: " + currentGrayzonePlanet.status.cic.x);

		if(!checkPlanetCollision(Rm,currentGrayzonePlanet,planetDistance) && currentGrayzonePlanet.checkWindowCollision()){
			Rm.objects[Object.keys(Rm.objects).length] = currentGrayzonePlanet;
		}
	}

}

function checkPlanetCollision(Rm, currentGrayzonePlanet, planetDistance){
	var dx,dy,distance;
	var radiusSum;
	var isColliding = false;

	for(var object in Rm.objects){
		var obj = Rm.objects[object];
		//console.log(obj);

		var currentGrayzonePlanetGetX = currentGrayzonePlanet.status.cic.x;
		var currentGrayzonePlanetGetY = currentGrayzonePlanet.status.cic.y;
		var currentGrayzonePlanetPlanetSize = currentGrayzonePlanet.status.cic.planetSize;
		//console.log("obj: " + obj.status.cic.x);

		dx = (currentGrayzonePlanetGetX + currentGrayzonePlanetPlanetSize / 2) - (obj.status.cic.x + obj.status.cic.planetSize / 2);
		dy = (currentGrayzonePlanetGetY + currentGrayzonePlanetPlanetSize / 2) - (obj.status.cic.y + obj.status.cic.planetSize / 2);
		distance  = dx * dx + dy * dy;
		radiusSum = currentGrayzonePlanet.planetSize / 2 + obj.status.cic.planetSize / 2;
		isColliding = distance < Math.pow(radiusSum + planetDistance, 2);
		if(isColliding){
			return true;
		}
	}
	return false;
}