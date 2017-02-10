const SETTINGS = require('../utils/SETTINGS.js');
const Baseobject = require("../utils/baseobject.js");

function playerPlanets(id,playerid,side,xPos,yPos,planetSize,planetScoreNumber){
	Baseobject.call(this);
	this.id = id;
	this.side = side;
	this.xPos = xPos;
	this.yPos = yPos;
	this.planetSize =  planetSize;
	this.planetScoreNumber = planetScoreNumber;
	this.color = side=="left"?"#FF0000":"#008000";
	this.ready = false;

	this.role = "playerPlanet";
	//this can be used to only send x,y and planetscore data
	this.status.score ={
		role:this.role,
		x:xPos,
		y:yPos,
		planetScoreNumber:planetScoreNumber
	};
	this.status.planet  = {
		role:this.role,
		id:id,
		planetSize:planetSize,
		planetScoreNumber:planetScoreNumber,
		color:this.color,
		x:xPos,
		y:yPos
	};

	this.update = function(room){
		this.status.planet.planetScoreNumber++;
	};
}

module.exports = playerPlanets;
