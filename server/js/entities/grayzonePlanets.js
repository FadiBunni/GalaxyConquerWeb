const SETTINGS = require('../utils/SETTINGS.js');
const Baseobject = require("../utils/baseobject.js");

function grayzonePlanets(id){
	Baseobject.call(this);
	var windowCollisionDistance = 10;
	var planetSize = Math.round(randomPlanetIntervalSize(50,80));
	var planetScoreNumber = Math.round(Math.random()*planetSize/2);
	const color = "#808080";
	var xPos = Math.round((Math.random()*SETTINGS.WIDTH));
	var yPos = Math.round((Math.random()*SETTINGS.HEIGHT));

	this.id = id;
	this.role = "grayzonePlanet";
	this.status.shape = "circle";
	this.status.cic   = {
		id:id,
		role:this.role,
		planetSize:planetSize,
		planetScoreNumber:planetScoreNumber,
		color:color,
		x:xPos,
		y:yPos
	};

	this.checkWindowCollision = function(){
		var left  = xPos-planetSize;
		var right = xPos+planetSize;
		var up    = yPos-planetSize;
		var down  = yPos+planetSize;

		//Made sure to spawn planet some distance away form window border(canvas).
		if(left < 0 + windowCollisionDistance || right > SETTINGS.WIDTH-windowCollisionDistance
		|| up < 0 + windowCollisionDistance || down > SETTINGS.HEIGHT-windowCollisionDistance){
			return false;
		}else return true;
	};

	//remove this metod when you have updated the STATE.
	this.update = function(){};
}

module.exports = grayzonePlanets;

function randomPlanetIntervalSize(min,max){
	var range = (max-min) + 1;
	return Math.random()*range + min;
}