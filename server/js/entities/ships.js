const Baseobject = require("../utils/baseobject.js");

function ships(id, playerid, startPlanet, endPlanet){
	Baseobject.call(this);
	this.id = id;
	this.playerid = playerid;
	this.role = "ship";


	this.status.ship = {

	};


	this.update = function(room){};



}