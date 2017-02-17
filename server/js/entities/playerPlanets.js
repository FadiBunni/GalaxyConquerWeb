const SETTINGS = require('../utils/SETTINGS.js');
const Baseobject = require("../utils/baseobject.js");

function playerPlanets(playerid,side,xPos,yPos,planetSize,planetScoreNumber){
	Baseobject.call(this);
	this.playerid = playerid;
	this.createdAt = Date.now();
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
		playerid:playerid,
		planetSize:planetSize,
		planetScoreNumber:planetScoreNumber,
		color:this.color,
		x:xPos,
		y:yPos
	};

	this.update = function(room,createdAt){
		var counter = Math.floor((Date.now()-createdAt)/1000);
		//console.log(createdAt);

		this.status.planet.planetScoreNumber = planetScoreNumber;
		this.status.planet.planetScoreNumber += counter;
	};
}

module.exports = playerPlanets;
