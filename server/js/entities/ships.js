const Baseobject = require("../utils/baseobject.js");

function ships(id, playerid, startPlanet, endPlanet){
	Baseobject.call(this);
	var xPos,yPos,xEnd,yEnd;
	this.id = id;
	this.playerid = playerid;
	this.startPlanet = startPlanet;
	this.endPlanet = endPlanet;
	this.amoutOfAttack = 1;
	this.speed = 2;
	this.role = "Ship";


	this.status.ship = {

	};


	this.update = function(room){};

	this.spawnShipsAroundPlayerPlanets = function(startPlanet){

	};

	this.getDirectionToCoords = function(xEnd, yEnd){

	};

	var moveShips = function(){

	};
}