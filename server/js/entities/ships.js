const Baseobject = require("../utils/baseobject.js");

function Ships(id,playerid,color,startPlanet,endPlanet){
	Baseobject.call(this);
	var self = this;
	var xPos,yPos,xEnd,yEnd,direction,speed,angle;
	speed = 4;
	direction = 1;
	var color = startPlanet.color;
	this.id = id;
	this.playerid = playerid;
	this.color = color;
	this.startPlanet = startPlanet;
	this.endPlanet = endPlanet;
	this.amoutOfAttack = 1;
	startPlanet.status.planet.planetScoreNumber--;

	this.spawnShipsAroundPlayerPlanets = (function(){
		const p = startPlanet;
		const m = Math.random();
		var centerX, centerY, radiusX, radiusY;
		centerX = p.xPos;
		centerY = p.yPos;
		//console.log(p.xPos);
		radiusX = p.planetSize;
		radiusY = p.planetSize;
		xPos = (radiusX + 10) * (Math.cos(toRadians(Math.floor(m*360)))) + centerX;
		yPos = (radiusY + 10) * (Math.sin(toRadians(Math.floor(m*360)))) + centerY;
	})();

	this.role = "ship";
	this.status.ship = {
		id:id,
		role:this.role,
		playerid:playerid,
		color:color,
		xPos:xPos,
		yPos:yPos
	};

	this.update = function(room){
		this.status.ship.xPos += speed * Math.cos(direction);
		this.status.ship.yPos += speed * Math.sin(direction);
		//angle = 90;
	};

	this.getDirectionToCoords = function(xEnd,yEnd){

	};
}

module.exports = Ships;

function toRadians(degrees){
	return degrees * (Math.PI / 180);
}