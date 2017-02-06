(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
function drawObjects(ctx,status){
	switch(status.shape){
	  case "circle":
	  	var status = status.cic;
	  	ctx.save();
	    ctx.fillStyle = status.color;
	    ctx.globalAlpha = 0.85;
	    ctx.beginPath();
	    ctx.arc(status.x,status.y,status.planetSize,0,2*Math.PI);
	    ctx.stroke();
	    ctx.fill();
	    ctx.textBaseline="middle";
	    ctx.textAlign = 'center';
	    ctx.fillStyle = "white";
	    ctx.font = "16px verdana";
	    ctx.fillText(status.planetScoreNumber,status.x,status.y);
	    ctx.restore();
	    break;
	}
}

module.exports = drawObjects;

},{}],2:[function(require,module,exports){
const cUtils = require('./utils/canvas.js');
const STATES = require('./utils/STATES.js');
var GAME_SETTINGS = null;
var Interval = 10;

var socket = io();

var ctx = canvas.getContext('2d');

var serverObjects=[];

socket.on('connected', function(SERVER_GAME_SETTINGS){
	GAME_SETTINGS = SERVER_GAME_SETTINGS;
	const canvas = cUtils.generateCanvas(GAME_SETTINGS.WIDTH, GAME_SETTINGS.HEIGHT);
	STATES.start.initialize(canvas,ctx,socket,GAME_SETTINGS);
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
	STATES.ready.initialize(canvas,ctx,socket,GAME_SETTINGS,serverObjects);
});

socket.on('init', function(statuses){
	serverObjects = statuses;
});

socket.on('playing', function(){
	STATES.ready.destroy();
	STATES.playing.initialize();
});

socket.on('update', function(statuses){
	serverObjects = statuses;
});

socket.on('destroy', function(SERVER_MESSAGE){
	STATES.ready.destroy();
	STATES.playing.destroy();
	STATES.backToOpeningScene.initialize(canvas,ctx,socket,GAME_SETTINGS,SERVER_MESSAGE);
});
},{"./utils/STATES.js":3,"./utils/canvas.js":5}],3:[function(require,module,exports){
const Drawobjects = require('../entities/drawObjects.js');
const Img    = require('./imgimport.js');
const Button = require('./button.js');
const Text   = require('./text.js');
const INTERVAL = 10;

var params = [];

var mainLoop = function(){};
var interval = setInterval(function(){
  mainLoop();
},INTERVAL);

var start = {
  misc: function(canvas,ctx,socket,GAME_SETTINGS){
    var self = this;
    self.button1 = new Button();
    self.button1.click = function(){
      start.toWait(canvas,ctx,socket,GAME_SETTINGS);
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

  initialize: function(canvas,ctx,socket,GAME_SETTINGS){
    //Run misc() to get all function inside it.
  	this.misc(canvas,ctx,socket,GAME_SETTINGS);
    Img('spaceship',ctx);
    start.button1.initialize(canvas,ctx,GAME_SETTINGS, {
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
    params.push(canvas,ctx,socket,GAME_SETTINGS);
    mainLoop = start.loop;
  },

  loop: function(){
    start.button1.update();
    start.button1.draw();
  },

  destroy:function(){
    $(canvas).off();
    canvas.removeEventListener("touchstart", start.button1.events.touchstart);
    canvas.removeEventListener("touchmove", start.button1.events.touchmove);
    canvas.removeEventListener("touchend", start.button1.events.touchend);
  },

  toWait: function(canvas,ctx,socket,GAME_SETTINGS){
    start.destroy();
    socket.emit('waiting');
    ctx.clearRect(0,0,GAME_SETTINGS.WIDTH,GAME_SETTINGS.HEIGHT);
    waiting.initialize(canvas,ctx,GAME_SETTINGS);
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

  initialize: function(canvas,ctx,GAME_SETTINGS){
    this.misc();
    Img('spaceship',ctx);
    waiting.text1.initialize(canvas,ctx,GAME_SETTINGS,{
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
  misc: function(socket,ctx,GAME_SETTINGS,serverObjects){
    var self = this;
    self.text1 = new Text();
    self.button1 = new Button();
    self.button1.click = function(){
      //set player to be ready.
      socket.emit('ready');
      ctx.clearRect(0,0,GAME_SETTINGS.WIDTH,GAME_SETTINGS.HEIGHT);
      Img('spaceship',ctx,function(){
       drawGrayzonePlanets(ctx,serverObjects);
      });
      ready.text1.data.text.message = "waiting for opponent to be ready";
      delete ready.button1.data;
      ready.destroy();
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
  initialize: function(canvas,ctx,socket,GAME_SETTINGS,serverObjects){
    this.misc(socket,ctx,GAME_SETTINGS,serverObjects);
    ctx.clearRect(0,0,GAME_SETTINGS.WIDTH,GAME_SETTINGS.HEIGHT);

    Img('spaceship',ctx,function(){
      drawGrayzonePlanets(ctx,serverObjects);
    });

    ready.text1.initialize(canvas,ctx,GAME_SETTINGS,{
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
    ready.button1.initialize(canvas,ctx,GAME_SETTINGS,{
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
    if(ready.button1.data){
      ready.button1.update();
      ready.button1.draw();
    }
    ready.text1.draw();
  },

  destroy:function(){
    $(canvas).off();
    canvas.removeEventListener("touchstart", ready.button1.events.touchstart);
    canvas.removeEventListener("touchmove", ready.button1.events.touchmove);
    canvas.removeEventListener("touchend", ready.button1.events.touchend);
  }
};

var playing = {
  misc: function(){},
  initialize: function(){},
  loop: function(){},
  destroy:function(){}
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

  initialize: function(canvas,ctx,socket,GAME_SETTINGS,SERVER_MESSAGE){
    this.misc();
    ctx.clearRect(0,0,GAME_SETTINGS.WIDTH,GAME_SETTINGS.HEIGHT);
    backToOpeningScene.count = 0;
    backToOpeningScene.text1.initialize(canvas,ctx,GAME_SETTINGS,{
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
    backToOpeningScene.text2.initialize(canvas,ctx,GAME_SETTINGS,{
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
      params[1].clearRect(0,0,params[3].WIDTH,params[3].HEIGHT);
      start.initialize(params[0],params[1],params[2],params[3])
    }
  },

  destroy: function(socket){}
};


module.exports = {start,waiting,ready,playing,backToOpeningScene};

function drawGrayzonePlanets(ctx,serverObjects){
  for(object in serverObjects){
    obj = serverObjects[object];
    Drawobjects(ctx,obj);
  }
}
},{"../entities/drawObjects.js":1,"./button.js":4,"./imgimport.js":6,"./text.js":7}],4:[function(require,module,exports){
const Text = new (require('./text.js'));

function Button(canvas,ctx,GAME_SETTINGS,data) {

	this.events = {};

	this.initialize = function(canvas, ctx, GAME_SETTINGS, data){
    //Text.initialize.call(this, canvas, ctx, GAME_SETTINGS, data);
    Text.initialize.call(this,canvas, ctx, GAME_SETTINGS, data);
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
    //This is declared as a n global obtject, try to add 'var' later. 
    buttonObject = this;
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

    canvas.addEventListener("touchstart",this.events.touchstart);
    canvas.addEventListener("touchmove",this.events.touchmove);
    canvas.addEventListener("touchend",this.events.touchend);
  };

	this.events.touchstart = function(e){
    e.preventDefault();
    buttonObject.mousemove(e);

  };

	this.events.touchmove  = function(e){
    buttonObject.mousemove(e);
  };

	this.events.touchend   = function(e){
    var x = e.changedTouches[0].clientX-e.changedTouches[0].target.offsetLeft;
    var y = e.changedTouches[0].clientY-e.changedTouches[0].target.offsetTop;
    var rect = buttonObject.data.rect;
    if(pointSquareCollisionCheck(x,y,rect)){
      buttonObject.click();
    }
  };

  this.mousemove = function(e){
    if(this.data){
      var x,y;
      if(e.type == 'mousemove'){
        x = e.offsetX;
        y = e.offsetY;
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
},{"./text.js":7}],5:[function(require,module,exports){
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

	generateCanvas : function generateCanvas(w, h) {
	  console.log('Generating canvas.');

	  var canvas = document.getElementById('canvas');
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
},{}],6:[function(require,module,exports){
function imgImport(imgName,ctx,callback){
	var img = new Image();
	img.onload = function(){
		ctx.drawImage(img,0,0);
		if (callback) {
    		callback();
		}
	};
	img.src = 'client/img/' + imgName + '.jpg';
}

module.exports = imgImport;

},{}],7:[function(require,module,exports){
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
},{}]},{},[2]);
