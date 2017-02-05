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


	//One way to determin if grayzone or playerplanet is by using role.
	this.role = "playerPlanet";
	this.status.shape = "circle";
	this.status.cic   = {
		id:id,
		role:this.role,
		planetSize:planetSize,
		planetScoreNumber:planetScoreNumber,
		color:this.color,
		x:xPos,
		y:yPos
	};

	//remove this metod when you have updated the STATE.
	this.update = function(){};
}

module.exports = playerPlanets;
