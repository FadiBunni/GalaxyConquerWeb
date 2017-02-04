const SETTINGS = require('../utils/SETTINGS.js');
const Baseobject = require("../utils/baseobject.js");

function grayzonePlantes(id){
	Baseobject.call(this);
	var planetSize = Math.round(randomPlanetIntervalSize(20,105));
	var planetScoreNumber = Math.round(Math.random()*planetSize);
	const color = "#808080";
	var xPos = Math.round((Math.random()*SETTINGS.WIDTH) + planetSize / 2);
	var yPos = Math.round((Math.random()*SETTINGS.HEIGHT) + planetSize / 2);

	this.id = id;
	this.role = "grayzonePlant";
	this.status.shape = "circle";
	this.status.cic   = {
		planetSize:planetSize,
		planetScoreNumber:planetScoreNumber,
		color:color,
		x:xPos,
		y:yPos
	};

	this.checkWindowCollision = function(){
		var left  = xPos;
		var right = xPos+planetSize;
		var up    = yPos;
		var down  = yPos+planetSize;

		if(left < 0 || right > SETTINGS.WIDTH || up < 0 || down > SETTINGS.HEIGHT){
			return true;
		}
		else return false;
	};
	//remove this metod when you have updated the STATE.
	this.update = function(){};
}

module.exports = grayzonePlantes;

function randomPlanetIntervalSize(min,max){
	const range = (max-min) + 1;
	return Math.random()*range + min;
}