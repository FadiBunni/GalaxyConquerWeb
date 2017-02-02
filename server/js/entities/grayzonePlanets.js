const SETTINGS = require('../utils/SETTINGS.js');
const Baseobject = require("../utils/baseobject.js");

function grayzonePlantes(id){
	Baseobject.call(this);
	const planetSize = randomPlanetIntervalSize(60,105);
	var planetScoreNumber = Math.random()*planetSize;
	const color = "#808080";
	const xPos = Math.random()*SETTINGS.WIDTH*planetSize / 2;
	const yPos = Math.random()*SETTINGS.HEIGHT*planetSize / 2;

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
}

module.exports = grayzonePlantes;

function randomPlanetIntervalSize(min,max){
	const range = (max-min) + 1;
	return Math.random()*range + min;
}

