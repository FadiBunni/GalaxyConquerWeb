(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var drawObjects = {
  drawPlanets: function(ctx,status){
    //console.log(status);
    switch(status.role){
      case "grayzonePlanet":
        //console.log('grayzonePlanet');
        drawPlanets(ctx,status);
        break;
      case "playerPlanet":
        //console.log('playerPlanet');
        drawPlanets(ctx,status);
        break;
    }
  },

  drawShips: function(ctx,status){
    switch(status.role){
      case "Ships":
        drawShips(ctx,status);
        break;
    }
  },

  selectBorder: function(ctx,status,socket){
    switch (status.role){
      case "playerPlanet":
        //console.log('heeey');
        drawBorderPlanet(ctx,status,socket);
        break;
    }
  },

  Timer: function(ctx,status){
    switch(status.role){
      case "countdown":
        //console.log('countdown');
        drawTimerText(ctx,status);
        break;
    }
  }
};

module.exports = drawObjects;

function drawPlanets(ctx,status){
  ctx.save();
  ctx.fillStyle = status.color;
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.arc(status.x,status.y,status.planetSize,0,2*Math.PI);
  ctx.fill();
  drawTextOnPlanets(ctx,status);
  ctx.restore();
}

function drawTextOnPlanets(ctx,status){
  ctx.textBaseline="middle";
  ctx.textAlign = 'center';
  ctx.fillStyle = "white";
  ctx.font = "16px verdana";
  ctx.fillText(status.planetScoreNumber,status.x,status.y);
}

function drawShips(ctx,status){
  console.log("drawing!");
  //The triangle
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(100,100);
  ctx.lineTo(100,300);
  ctx.lineTo(150,300);
  ctx.closePath();
  //The outline
  ctx.lineWidth =1;
  ctx.strokeStyle = 'black';
  ctx.stroke();
  //the fill color
  ctx.fillStyle = "#FFCC00";
  ctx.fill();
  ctx.restore();
}

function drawBorderPlanet(ctx,status,socket){
  if(status.playerid === socket.id){;
    ctx.save();
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.arc(status.x,status.y,status.planetSize+1,0,2*Math.PI);
    ctx.stroke();
  }
}

function drawTimerText(ctx, status){
  if(!status.color) return;
  ctx.clearRect(status.x-32,status.y-22,64,42);
  ctx.save();
  ctx.beginPath();
  ctx.font = status.size+"px "+status.font;
  ctx.textAlign = status.textAlign;
  ctx.textBaseline = status.textBaseline;
  ctx.globalAlpha = status.globalAlpha!==undefined?status.globalAlpha:1;
  if(status.color.stroke){
    ctx.strokeStyle = status.color.stroke;
    ctx.lineWidth = status.lineWidth;
    ctx.strokeText(status.message, status.x, status.y);
  }
  if(status.color.fill){
    ctx.fillStyle = status.color.fill;
    ctx.fillText(status.message, status.x, status.y);
  }
  ctx.restore();
}



},{}],2:[function(require,module,exports){
const cUtils = require('./utils/canvas.js');
const STATES = require('./utils/STATES.js');
var GAME_SETTINGS = null;
var Interval = 10;

var socket = io();

var ctxS = canvasStatic.getContext('2d');
var ctxD = canvasDynamic.getContext('2d');
var ctxU = canvasUI.getContext('2d');

socket.on('connected', function(SERVER_GAME_SETTINGS){
	GAME_SETTINGS = SERVER_GAME_SETTINGS;
	const canvasStatic = cUtils.generateCanvasStatic(GAME_SETTINGS.WIDTH, GAME_SETTINGS.HEIGHT);
	const canvasDynamic = cUtils.generateCanvasDynamic(GAME_SETTINGS.WIDTH, GAME_SETTINGS.HEIGHT);
	const canvasUI = cUtils.generateCanvasUI(GAME_SETTINGS.WIDTH, GAME_SETTINGS.HEIGHT);
	STATES.start.initialize(canvasStatic,canvasDynamic,canvasUI,ctxS,ctxD,ctxU,socket,GAME_SETTINGS);
});

//Prints out the new user entered
socket.on('new user entered', function(){
	console.log("new user entered");
});

//Total user count update
socket.on('total user count updated', function(count){
	window.document.title = GAME_SETTINGS.TITLE+" ("+count+")";
});

socket.on('ready', function(){
	STATES.ready.initialize(canvasStatic,canvasDynamic,canvasUI,ctxS,ctxD,ctxU,socket,GAME_SETTINGS);
});

socket.on('init', function(statuses){
	STATES.setServerObjects(statuses);
	//console.log(statuses);
});

socket.on('update', function(statuses){
	STATES.setServerTimerMessage(statuses);
	STATES.setServerObjects(statuses);
	//console.log(statuses);
});

socket.on('playing', function(){
	STATES.ready.destroy();
	STATES.playing.initialize(canvasStatic,canvasDynamic,canvasUI,ctxS,ctxD,ctxU,socket,GAME_SETTINGS);
});

socket.on('destroy', function(SERVER_MESSAGE){
	STATES.ready.destroy();
	STATES.playing.destroy();
	STATES.backToOpeningScene.initialize(canvasStatic,canvasDynamic,canvasUI,ctxS,ctxD,ctxU,socket,GAME_SETTINGS,SERVER_MESSAGE);
});
},{"./utils/STATES.js":6,"./utils/canvas.js":7}],3:[function(require,module,exports){
const Text = new (require('./text.js'));

function Button() {

	this.initialize = function(canvas, ctx, GAME_SETTINGS, data){
    //Text.initialize.call(this, canvas, ctx, GAME_SETTINGS, data);
    Text.initialize.call(this, canvas, ctx, GAME_SETTINGS, data);
    var rect = this.data.rect;
    var text = this.data.text;
    rect.x = rect.x?rect.x:text.x?text.x:GAME_SETTINGS.WIDTH/2;
    rect.y = rect.y?rect.y:text.y?text.y:GAME_SETTINGS.HEIGHT/2;
    rect.color=rect.colorData.default
    if(this.setEvents){
      this.setEvents(canvas);
    }
  };

	this.setEvents = function(canvas){
    //This is declared as an global object, try to add 'var' later.
    buttonObject = this;
    //console.log(buttonObject);
    $(canvas).on('click', function(e){
      if(buttonObject.data){
        //console.log('clicked');
        var rect = buttonObject.data.rect;
        if(pointSquareCollisionCheck(e.offsetX, e.offsetY, rect)){
          buttonObject.click();
        }
      }
    });

    $(canvas).on('mousemove',function(e){
      buttonObject.mousemove(e);
    });

  };

  this.mousemove = function(e){
    if(this.data){
      var x,y;
      if(e.type == 'mousemove'){
        x = e.offsetX;
        y = e.offsetY;
        //console.log("buttonX: " + x);
      } else {
        x = e.changedTouches[0].clientX-e.changedTouches[0].target.offsetLeft;
        y = e.changedTouches[0].clientY-e.changedTouches[0].target.offsetTop;
      }
      var rect = this.data.rect;
      var text = this.data.text;
      var mouseover = pointSquareCollisionCheck(x, y, rect);

      rect.color = mouseover?rect.colorData.mouseover:rect.colorData.default;
      text.color = mouseover?text.colorData.mouseover:text.colorData.default;
    }
  };

  this.draw = function() {
    if(!this.data) return;
      drawRect(this.ctx, this.data.rect);
      Text.draw.call(this);
  };
}

module.exports = Button;

function pointSquareCollisionCheck(x,y,square){
  if(x >= square.x-square.width/2 && x <= square.x+square.width/2 && y >= square.y-square.height/2 && y <= square.y+square.height/2 ){
    return true;
  }
}

function drawRect(ctx, rect){
  if(!rect.color) return;
  ctx.save();
  ctx.beginPath();

  ctx.globalAlpha = rect.globalAlpha!==undefined?rect.globalAlpha:1;
  if(rect.color.fill){
    ctx.fillStyle = rect.color.fill;
    ctx.fillRect(rect.x-rect.width/2,rect.y-rect.height/2,rect.width,rect.height);
  }
  if(rect.color.stroke){
    ctx.strokeStyle = rect.color.stroke;
    ctx.lineWidth = rect.lineWidth;
    ctx.rect(rect.x-rect.width/2,rect.y-rect.height/2,rect.width,rect.height);
    ctx.stroke();
  }
  ctx.restore();
}
},{"./text.js":5}],4:[function(require,module,exports){
function Dynamicrect(canvas,ctx,GAME_SETTINGS){
	this.canvas = canvas;
	this.ctx = ctx;
	this.GAME_SETTINGS = GAME_SETTINGS;
	this.rect = {};
	var drag = false;

	this.initialize = function(){
		if(this.setEvents){
	      this.setEvents();
	    }
	};

	this.setEvents = function(){
		rectObject = this;

		$(canvas).on('mousedown',function(e){
			// switch (event.which){
			// 	case 1:
					rectObject.mouseDown(e);
			// 		break;
			// }
		});

		$(canvas).on('mousemove',function(e){
      		rectObject.mouseMove(e);
   		});

   		$(canvas).on('mouseup',function(e){
			rectObject.mouseUp(e)
		});
	};

	this.mouseDown = function(e){
		this.rect.w = null;
		this.rect.h = null;
		if(e.type == 'mousedown'){
		this.rect.startX = e.offsetX;
		this.rect.startY = e.offsetY;
		// console.log("rect_startX: " + this.rect.startX);
		// console.log("rect_startY: " + this.rect.startY);
		}
		drag = true;
	};

	this.mouseMove = function(e){
		if(drag && e.type == 'mousemove'){
			this.rect.w = e.offsetX - this.rect.startX;
			this.rect.h = e.offsetY - this.rect.startY;
			// console.log("rectdragW: "+ this.rect.w)
			// console.log("rectdragH: "+ this.rect.h)
			ctx.clearRect(0,0,GAME_SETTINGS.WIDTH,GAME_SETTINGS.HEIGHT);
			this.draw();
		}
	};

	this.mouseUp = function(){
		ctx.clearRect(0,0,GAME_SETTINGS.WIDTH,GAME_SETTINGS.HEIGHT);
		drag = false;
	};

	this.draw = function(){
		ctx.strokeStyle = '#000000';
		ctx.strokeRect(this.rect.startX, this.rect.startY, this.rect.w, this.rect.h);
	};
}

module.exports = Dynamicrect;
},{}],5:[function(require,module,exports){
function Text(){
	this.initialize = function(canvas,ctx,GAME_SETTINGS,data){
		this.canvas = canvas;
		this.ctx = ctx;
		this.GAME_SETTINGS = GAME_SETTINGS;
		this.data = data;

		var text = this.data.text;
		var animation = data.animation;
		text.x = text.x?text.x:GAME_SETTINGS.WIDTH/2;
		text.y = text.y?text.y:GAME_SETTINGS.HEIGHT/2;
		text.color = text.colorData.default;
	};

	this.draw = function() {
		if(!this.data) return;
		drawText(this.ctx, this.data.text);
	};
}

module.exports = Text;

function drawText(ctx, text){
  if(!text.color) return;
  ctx.save();
  ctx.beginPath();

  ctx.font = text.size+"px "+text.font;
  ctx.textAlign = text.textAlign;
  ctx.textBaseline = text.textBaseline;
  ctx.globalAlpha = text.globalAlpha!==undefined?text.globalAlpha:1;
  if(text.color.stroke){
    ctx.strokeStyle = text.color.stroke;
    ctx.lineWidth = text.lineWidth;
    ctx.strokeText(text.message, text.x, text.y);
  }
  if(text.color.fill){
    ctx.fillStyle = text.color.fill;
    ctx.fillText(text.message, text.x, text.y);
  }
  ctx.restore();
}
},{}],6:[function(require,module,exports){
const Drawobjects = require('../entities/drawObjects.js');
const Img    = require('./imgimport.js');
const Button = require('../objects/button.js');
const Text   = require('../objects/text.js');
const Dynamicrect = require('../objects/dynamicrect.js');
const INTERVAL = 20;

var params = [];
var serverObjects = [];

var mainLoop = function(){};
function theLoop(){
  mainLoop();
  requestAnimationFrame(theLoop);
}
requestAnimationFrame(theLoop);

var start = {
  misc: function(canvasStatic,canvasDynamic,canvasUI,ctxS,ctxD,ctxU,socket,GAME_SETTINGS){
    var self = this;
    self.button1 = new Button();
    self.button1.click = function(){
      start.toWait(canvasStatic,canvasDynamic,canvasUI,ctxS,ctxD,ctxU,socket,GAME_SETTINGS);
    };
    self.button1.update = function(){
      var text = this.data.text;
      var animation = this.data.animation;
      animation .count += animation.dir;
      if(animation.count <= 0 || animation.count >= animation.maxCount){
        animation.dir *= -1;
      }
      text.globalAlpha = 0.2 + 0.7*(animation.count/1000);
    };
  },

  initialize: function(canvasStatic,canvasDynamic,canvasUI,ctxS,ctxD,ctxU,socket,GAME_SETTINGS){
    //Run misc() to get all function inside it.
  	this.misc(canvasStatic,canvasDynamic,canvasUI,ctxS,ctxD,ctxU,socket,GAME_SETTINGS);
    Img('spaceship',ctxS);
    start.button1.initialize(canvasUI,ctxU,GAME_SETTINGS, {
      text:{
        x: undefined,
        y: 310,
        size: 30,
        font: "Arial",
        textBaseline: "middle",
        textAlign: "center",
        lineWidth: 2,
        message: "START GAME",
        color: {fill:undefined, stroke:undefined},
        colorData: {
          default: {fill:"#FF0000", stroke:undefined},
          mouseover: {fill:"#FF0000", stroke: undefined}
        }
      },
      rect: {
        x: undefined,
        y: undefined,
        width: 230,
        height: 50,
        lineWidth: 2,
        color: {fill:undefined, stroke:undefined},
        colorData: {
          default: {fill:"#66CDAA", stroke:"#FF0000"},
          mouseover: {fill:"#FFFFFF", stroke:"#FF0000"}
        }
      },
      animation: {
        maxCount: 1000,
        count: 0,
        dir: 10,
      }
    });
    params.push(canvasStatic,canvasDynamic,canvasUI,ctxS,ctxD,ctxU,socket,GAME_SETTINGS);
    mainLoop = start.loop;
  },

  loop: function(){
    start.button1.update();
    start.button1.draw();
  },

  destroy:function(){
  },

  toWait: function(canvasStatic,canvasDynamic,canvasUI,ctxS,ctxD,ctxU,socket,GAME_SETTINGS){
    start.destroy();
    socket.emit('waiting');
    ctxU.clearRect(0,0,GAME_SETTINGS.WIDTH,GAME_SETTINGS.HEIGHT);
    waiting.initialize(canvasStatic,canvasDynamic,canvasUI,ctxS,ctxD,ctxU,socket,GAME_SETTINGS);
  }
};

var waiting = {
  misc: function(){
    var self = this;
    self.text1 = new Text();
    self.text1.update = function(){
      var text = this.data.text;
      var animation = this.data.animation;
      animation.count += animation.dir;
      if(animation.count <= 0 || animation.count >= animation.maxCount ){
        animation.dir *= -1;
      }
      text.globalAlpha = 0.2 + 0.7*(animation.count/100);
    };
  },

  initialize: function(canvasStatic,canvasDynamic,canvasUI,ctxS,ctxD,ctxU,socket,GAME_SETTINGS){
    this.misc();
    waiting.text1.initialize(canvasUI,ctxU,GAME_SETTINGS,{
      text:{
        x: undefined,
        y: undefined,
        size: 40,
        font: "Arial",
        textBaseline: "middle",
        textAlign: "center",
        lineWidth: 2,
        message: "WAITING FOR OPPONENT..",
        globalAlpha: undefined,
        color: {fill: undefined, stroke: undefined},
        colorData: {
          default: {fill: "#FFFFFF", stroke: "#000000"}
        }
      },
      animation: {
        maxCount: 150,
        count: 0,
        dir: 1,
      }
    });
    mainLoop = waiting.loop;
  },

  loop: function(){
    waiting.text1.update();
    waiting.text1.draw();
  },

  destroy:function(){}
};

var ready = {
  misc: function(socket,ctxD,ctxU,GAME_SETTINGS){
    var self = this;
    self.text1 = new Text();
    self.button1 = new Button();
    self.button1.click = function(){
      //set player to be ready.
      ctxU.clearRect(0,0,GAME_SETTINGS.WIDTH,GAME_SETTINGS.HEIGHT);
      drawObjects(ctxD,serverObjects);
      ready.text1.data.text.message = "The game will start when your apponent is ready";
      delete ready.button1.data;
      ready.destroy();
      socket.emit('ready');

    };
    self.button1.update = function(){
      var text = this.data.text;
      var animation = this.data.animation;
      animation.count += animation.dir;
      if(animation.count <= 0 || animation.count >= animation.maxCount){
        animation.dir *= -1;
      }
      text.globalAlpha = 0.5 + 0.5*(animation.count/1000);
    };
  },
  initialize: function(canvasStatic,canvasDynamic,canvasUI,ctxS,ctxD,ctxU,socket,GAME_SETTINGS){
    this.misc(socket,ctxD,ctxU,GAME_SETTINGS);
    ctxU.clearRect(0,0,GAME_SETTINGS.WIDTH,GAME_SETTINGS.HEIGHT);

    drawObjects(ctxD,serverObjects);
    ready.text1.initialize(canvasUI,ctxU,GAME_SETTINGS,{
      text:{
        x: GAME_SETTINGS.WIDTH/2,
        y: undefined,
        size: 25,
        font: "Arial",
        textBaseline: "middle",
        textAlign: "center",
        lineWidth: 2,
        message: "An apponent has been found, click 'READY' when you are",
        globalAlpha: undefined,
        color: {fill: undefined, stroke: undefined},
        colorData: {
          default: {fill: "#FFFFFF", stroke: undefined}
        }
      }
    });
    ready.button1.initialize(canvasUI,ctxU,GAME_SETTINGS,{
      rect: {
        x: GAME_SETTINGS.WIDTH/2,
        y: GAME_SETTINGS.HEIGHT/2+40,
        width: 150,
        height: 40,
        lineWidth: 2,
        color: {fill:undefined, stroke:undefined},
        colorData: {
          default: {fill:"#ffce54", stroke:undefined},
          mouseover: {fill:"#f6bb42", stroke:undefined}
        }
      },
      text:{
        x: GAME_SETTINGS.WIDTH/2,
        y: GAME_SETTINGS.HEIGHT/2+40,
        size: 28,
        font: "Arial",
        textBaseline: "middle",
        textAlign: "center",
        lineWidth: undefined,
        message: "READY",
        color: {fill:undefined, stroke:undefined},
        colorData: {
          default: {fill:"#123456", stroke:undefined},
          mouseover: {fill:"#ffffff", stroke:undefined}
        }
      },
      animation: {
        maxCount: 1000,
        count: 0,
        dir: 10,
      }
    });
   mainLoop = ready.loop;
  },

  loop: function(){
    drawTimerMessage(params[5],serverObjects);
    if(ready.button1.data){
      ready.button1.update();
      ready.button1.draw();
    }
    ready.text1.draw();
  },

  destroy:function(){
  }
};

var playing = {
  misc: function(canvasUI,ctxU,GAME_SETTINGS){
    var self = this;
    self.dynamicrect1 = new Dynamicrect(canvasUI,ctxU,GAME_SETTINGS);
  },

  initialize: function(canvasStatic,canvasDynamic,canvasUI,ctxS,ctxD,ctxU,socket,GAME_SETTINGS){
    this.misc(canvasUI,ctxU,GAME_SETTINGS);
    ctxU.clearRect(0,0,GAME_SETTINGS.WIDTH,GAME_SETTINGS.HEIGHT);
    playing.dynamicrect1.initialize();

    mainLoop = playing.loop;
  },

  loop: function(){
    //clearBackground(params[4],params[7]);
    //params[6].emit('spawnShips');
    drawObjects(params[4],serverObjects);
    //Drawobjects.drawShips(params[4]);
    if(planetDynamicRectIntersect(serverObjects,playing.dynamicrect1,params[6])){
      drawBorderAroundPlanet(params[5],serverObjects,params[6]);
    }

  },

  destroy: function(){

  }
};

var backToOpeningScene = {
  misc: function(){
    var self = this;
    self.text1 = new Text();
    self.text1.update = function(){
      var text = this.data.text;
      var animation = this.data.animation;
      animation.count++;
      text.globalAlpha = 0.2 + 0.7*(animation.count/100);
    };
    self.text2 = new Text();
    self.text2.update = function(){
      var text = this.data.text;
      var animation = this.data.animation;
      if(animation.count == 0) text.color = undefined;
      animation.count++;
      if(animation.count == 101){
        text.color = text.colorData.default;
      }
      if(animation.count > 100) text.globalAlpha = ((animation.count-100)/150);
    }
  },

  initialize: function(canvasStatic,canvasDynamic,canvasUI,ctxS,ctxD,ctxU,socket,GAME_SETTINGS,SERVER_MESSAGE){
    this.misc();
    ctxS.clearRect(0,0,GAME_SETTINGS.WIDTH,GAME_SETTINGS.HEIGHT);
    ctxD.clearRect(0,0,GAME_SETTINGS.WIDTH,GAME_SETTINGS.HEIGHT);
    ctxU.clearRect(0,0,GAME_SETTINGS.WIDTH,GAME_SETTINGS.HEIGHT);
    backToOpeningScene.count = 0;
    backToOpeningScene.text1.initialize(canvasUI,ctxU,GAME_SETTINGS,{
      text:{
        x: undefined,
        y: GAME_SETTINGS.HEIGHT/2-20,
        size: 32,
        font: "Arial",
        textBaseline: "middle",
        textAlign: "center",
        lineWidth: undefined,
        message: SERVER_MESSAGE?SERVER_MESSAGE:"OPPONENT LEFT!",
        globalAlpha: undefined,
        color: {fill: undefined, stroke: undefined},
        colorData: {default:{fill: "#000000", stroke: undefined}}
      },
      animation: {
        maxCount: 200,
        count: 0,
      }
    });
    backToOpeningScene.text2.initialize(canvasUI,ctxU,GAME_SETTINGS,{
      text:{
        x: undefined,
        y: GAME_SETTINGS.HEIGHT/2+20,
        size: 25,
        font: "Arial",
        textBaseline: "middle",
        textAlign: "center",
        lineWidth: undefined,
        message: "GOING BACK TO START..",
        globalAlpha: undefined,
        color: {fill: undefined, stroke: undefined},
        colorData: {default:{fill: "#000000", stroke: undefined}}
      },
      animation: {
        count: 0,
      }
    });
    mainLoop = backToOpeningScene.loop;
  },

  loop: function(){
    backToOpeningScene.text1.update();
    backToOpeningScene.text2.update();
    backToOpeningScene.text1.draw();
    backToOpeningScene.text2.draw();
    backToOpeningScene.update();
  },

  update: function(){
    backToOpeningScene.count++;
    if(backToOpeningScene.count >= 500){
      params[3].clearRect(0,0,params[7].WIDTH,params[7].HEIGHT);
      params[5].clearRect(0,0,params[7].WIDTH,params[7].HEIGHT);
      start.initialize(params[0],params[1],params[2],params[3],params[4],params[5],params[6],params[7]);
    }
  },

  destroy: function(){}
};

module.exports = {start,waiting,ready,playing,backToOpeningScene,setServerObjects,setServerTimerMessage};

function drawObjects(ctx,serverObjects){
  this.serverObjects = serverObjects;
  for(objects in serverObjects){
    obj = serverObjects[objects];
    Drawobjects.drawPlanets(ctx,obj);
    //console.log(obj);
  }
}

function drawTimerMessage(ctx, serverObjects){
  this.serverObjects = serverObjects;
  for(objects in serverObjects){
    obj = serverObjects[objects];
    Drawobjects.Timer(ctx,obj);
    //console.log(obj);
  }
}

function drawBorderAroundPlanet(ctx,serverObjects,socket){
  this.serverObjects = serverObjects;
  for(objects in serverObjects){
    obj = serverObjects[objects];
    Drawobjects.selectBorder(ctx,obj,socket);
    //console.log(obj);
  }
}

function setServerObjects(statuses){
  //serverObjects = [];
  this.statuses = statuses;
  for(status in statuses){
    stat = statuses[status];
    if(stat.role === "grayzonePlanet" || stat.role === "playerPlanet"){
      serverObjects.push(stat)
    }
  }
  //console.log(serverObjects);
}

function setServerTimerMessage(statuses){
  serverObjects = [];
  this.statuses = statuses;
  for(status in statuses){
    stat = statuses[status];
    if(stat.role === "countdown"){
      serverObjects.push(stat)
    }
  };
  //console.log(serverObjects);
}

function clearBackground(ctx, GAME_SETTINGS){
  ctx.save();
  ctx.clearRect(0,0,GAME_SETTINGS.WIDTH,GAME_SETTINGS.HEIGHT);
  ctx.restore();
}

function planetDynamicRectIntersect(serverObjects,dynamicrect,socket){
  var rect = dynamicrect.rect;
  for(objects in serverObjects){
    var obj = serverObjects[objects];
    if(obj.playerid === socket.id){
      var circle = obj;
      var distX  = Math.abs(circle.x - (rect.startX + rect.w / 2));
      var distY  = Math.abs(circle.y - (rect.startY + rect.h / 2));
      var absRectWidth = Math.abs(rect.w);
      var absRectHeight = Math.abs(rect.h);

      // console.log("circle.x: " + circle.x);
      // console.log("circle.y: " + circle.y);
      // console.log("rect.startX: " + rect.startX);
      // console.log("rect.startY: " + rect.startY);
      // console.log("rect.w: " + rect.w);
      // console.log("rect.h: " + rect.h);
      // console.log("distanceX" + distX);
      // console.log("distanceY" + distY);

      if(distX > (absRectWidth / 2 + circle.planetSize)){return false;}
      if(distY > (absRectHeight / 2 + circle.planetSize)){return false;}

      if(distX <= (absRectWidth / 2)){return true;}
      if(distY <= (absRectHeight / 2)){return true;}

      var dx = distX-absRectWidth/2;
      var dy = distY-absRectHeight/2;
      return (dx*dx+dy*dy <= (circle.planetSize*circle.planetSize));
    }
  }
}

},{"../entities/drawObjects.js":1,"../objects/button.js":3,"../objects/dynamicrect.js":4,"../objects/text.js":5,"./imgimport.js":8}],7:[function(require,module,exports){
var Canvas = {
	getPixelRatio : function getPixelRatio(ctx) {
	  console.log('Determining pixel ratio.');

	  // I'd rather not have a giant var declaration block,
	  // so I'm storing the props in an array to dynamically
	  // get the backing ratio.
	  var backingStores = [
	    'webkitBackingStorePixelRatio',
	    'mozBackingStorePixelRatio',
	    'msBackingStorePixelRatio',
	    'oBackingStorePixelRatio',
	    'backingStorePixelRatio'
	  ];

	  var deviceRatio = window.devicePixelRatio;

	  // Iterate through our backing store props and determine the proper backing ratio.
	  var backingRatio = backingStores.reduce(function(prev, curr) {
	    return (ctx.hasOwnProperty(curr) ? ctx[curr] : 1);
	  });

	  // Return the proper pixel ratio by dividing the device ratio by the backing ratio
	  return deviceRatio / backingRatio;
	},

	generateCanvasStatic : function generateCanvas(w, h) {
	  console.log('Generating canvasStatic.');

	  var canvas = document.getElementById('canvasStatic');
	  var ctx = canvas.getContext('2d');
	  // Pass our canvas' context to our getPixelRatio method
	  var ratio = this.getPixelRatio(ctx);

	  // Set the canvas' width then downscale via CSS
	  canvas.width = Math.round(w * ratio);
	  canvas.height = Math.round(h * ratio);
	  canvas.style.width = w +'px';
	  canvas.style.height = h +'px';
	  // Scale the context so we get accurate pixel density
	  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

	  return canvas;
	},

	generateCanvasDynamic : function generateCanvas(w, h) {
	  console.log('Generating canvasDynamic.');

	  var canvas = document.getElementById('canvasDynamic');
	  var ctx = canvas.getContext('2d');
	  // Pass our canvas' context to our getPixelRatio method
	  var ratio = this.getPixelRatio(ctx);

	  // Set the canvas' width then downscale via CSS
	  canvas.width = Math.round(w * ratio);
	  canvas.height = Math.round(h * ratio);
	  canvas.style.width = w +'px';
	  canvas.style.height = h +'px';
	  // Scale the context so we get accurate pixel density
	  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

	  return canvas;
	},

	generateCanvasUI : function generateCanvas(w, h) {
	  console.log('Generating canvasDynamic.');

	  var canvas = document.getElementById('canvasUI');
	  canvas.oncontextmenu = function() {
		return false;
	  }
	  var ctx = canvas.getContext('2d');
	  // Pass our canvas' context to our getPixelRatio method
	  var ratio = this.getPixelRatio(ctx);

	  // Set the canvas' width then downscale via CSS
	  canvas.width = Math.round(w * ratio);
	  canvas.height = Math.round(h * ratio);
	  canvas.style.width = w +'px';
	  canvas.style.height = h +'px';
	  // Scale the context so we get accurate pixel density
	  ctx.setTransform(ratio, 0, 0, ratio, 0, 0);

	  return canvas;
	}
};

module.exports = Canvas;
},{}],8:[function(require,module,exports){
function imgImport(imgName,ctx,callback){
	var img = new Image();
	img.onload = function(){
		ctx.imageSmoothingEnabled = true;;
		ctx.drawImage(img,0,0);
		if (callback) {
    		callback();
		}
	};
	img.src = 'client/img/' + imgName + '.jpg';
}

module.exports = imgImport;

},{}]},{},[2]);
