const Baseobject = require("../utils/baseobject.js");

function Ships(id,playerid,color,startPlanet,endPlanet){
	Baseobject.call(this);
	var xPos,yPos,xEnd,yEnd,direction,speed,angle;
	var color = startPlanet.color;
	this.id = id;
	this.playerid = playerid;
	this.color = color;
	this.startPlanet = startPlanet;
	this.endPlanet = endPlanet;
	this.amoutOfAttack = 1;
	speed = 2;
	direction = 2;
	startPlanet.planetScoreNumber-1;
	spawnShipsAroundPlayerPlanets(startPlanet);

	this.role = "Ship";
	this.status.ship = {
		id:id,
		role:this.role,
		playerid:playerid,
		color:color,
		xPos:xPos,
		yPos:yPos
	};

	this.update = function(room){
		//moveShips();
	};

	this.getDirectionToCoords = function(xEnd,yEnd){

	};
}

module.exports = Ships;

function moveShips(){
	xPos += speed * Math.cos(direction);
	yPos += speed * Math.sin(direction);
	angle = 90;
}

function spawnShipsAroundPlayerPlanets (startPlanet){
	const p = startPlanet;
	const m = Math.random();
	const centerX, centerY, radiusX, radiusY;
	centerX = p.xPos + p.planetSize;
	centerY = p.yPos + p.planetSize;
	radiusX = p.planetSize;
	radiusY = p.planetSize;
	xPos = (radiusX + 10) * (Math.cos(toRadians(Math.floor(m*360)))) + centerX;
	yPos = (radiusY + 10) * (Math.cos(toRadians(Math.floor(m*360)))) + centerY;
}

function toRadians(degrees){
	return degrees * (Math.PI / 180);
}