const SETTINGS = require('../utils/SETTINGS.js');
const Baseobject = require("../utils/baseobject.js");
const Ships = require("./ships.js");

function playerPlanets(playerid,side,xPos,yPos,planetSize,planetScoreNumber){
	Baseobject.call(this);
	this.ships = {};
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
	this.status.score = {
		role:this.role,
		x:xPos,
		y:yPos,
		planetScoreNumber:planetScoreNumber
	};
	this.status.planet = {
		role:this.role,
		playerid:playerid,
		planetSize:planetSize,
		planetScoreNumber:planetScoreNumber,
		color:this.color,
		x:xPos,
		y:yPos
	};

	this.spawnShips = function(){
		var planetScoreNumberHalf = this.status.planet.planetScoreNumber/2;
		for(var i = 0; i < planetScoreNumberHalf; i++){
			this.ships[Object.keys(this.ships).length] = new Ships(Object.keys(this.ships).length,playerid,this.color,this,null);
			if(this.status.planet.planetScoreNumber <= 0){
				this.status.planet.planetScoreNumber = 0;
			}
			planetScoreNumber = this.status.planet.planetScoreNumber;
		}
		// console.log('playerid: ' + playerid);
		// console.log(Object.keys(this.ships).length)
	};

	this.update = function(room,createdAt){
		var counter = Math.floor((Date.now()-createdAt)/1000);
		//console.log(createdAt);
		this.status.planet.planetScoreNumber = planetScoreNumber;
		this.status.planet.planetScoreNumber += counter;
	};
}

module.exports = playerPlanets;
