const grayzonePlanet = require('../entities/grayzonePlanets.js');
const playerPlanet = require('../entities/playerPlanets.js');

function Room (RmMg, io, id, player0, player1){
	var amoutOfGrayzonePlanet = 20;
	var planetDistance = 20;
	var Rm = this;
	Rm.RmMg = RmMg;
	Rm.id = id;
	Rm.players = [player0,player1];
	Rm.planets = {};
	Rm.countDownObject = {};

	//Add players.
	Rm.planets[Rm.players[0].id] = new playerPlanet(Rm.players[0].id,"left",115,115,100,50);
	Rm.planets[Rm.players[1].id] = new playerPlanet(Rm.players[1].id,"right",1165,685,100,50);
	//Spawns grayzoneplanets with window collision and planet collision, see the functions below and in grayzonePlanets class.
	spawnGrayzonePlanets(Rm,amoutOfGrayzonePlanet,grayzonePlanet,planetDistance);
	// console.log(Rm.planets[0]);
	// console.log(Rm.planets[1]);
	// console.log(Object.keys(Rm.planets).length);


	//The room.loop is set in STATES.js!!!!!!!!
	Rm.runLoop = function(room) {
		//Too console.log the objects info, you need to return the data in STATES.js, see loop.
		// console.log("All objects: ");
		// console.log(room.loop(room));
		room.loop(room);

	};
}
module.exports = Room;

function spawnGrayzonePlanets(Rm,amoutOfGrayzonePlanet,grayzonePlanet, planetDistance){

	while(Object.keys(Rm.planets).length < amoutOfGrayzonePlanet){
		var currentGrayzonePlanet = new grayzonePlanet(Object.keys(Rm.planets).length);

		if(!checkPlanetCollision(Rm,currentGrayzonePlanet,planetDistance) && currentGrayzonePlanet.checkWindowCollision()){
			Rm.planets[Object.keys(Rm.planets).length] = currentGrayzonePlanet;
		}
	}
}

function checkPlanetCollision(Rm,currentGrayzonePlanet,planetDistance){
	for(var object in Rm.planets){
		var obj = Rm.planets[object];
		//console.log(obj);

		var currentGrayzonePlanetGetX = currentGrayzonePlanet.status.planet.x;
		var currentGrayzonePlanetGetY = currentGrayzonePlanet.status.planet.y;
		var currentGrayzonePlanetPlanetSize = currentGrayzonePlanet.status.planet.planetSize;
		//console.log("obj: " + obj.status.cic.x);

		var dx = currentGrayzonePlanetGetX - obj.status.planet.x;
		var dy = currentGrayzonePlanetGetY - obj.status.planet.y;
		var distance  = Math.sqrt(dx * dx + dy * dy);

		var radiusSum = currentGrayzonePlanetPlanetSize + obj.status.planet.planetSize;
		if(distance < radiusSum + planetDistance){
			return true;
		}
	}
	return false;
}