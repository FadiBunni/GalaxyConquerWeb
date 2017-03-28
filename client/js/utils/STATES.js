const Drawobjects = require('../entities/drawObjects.js');
const Img    = require('./imgimport.js');
const Button = require('../objects/button.js');
const Text   = require('../objects/text.js');
const Mouseevent  = require('../objects/mouseevent.js')
const INTERVAL = 20;

var params = [];
var serverPlanets = [];
var serverShips = [];
var serverTimers = [];
var currentPlanets;
var isStartPlanetSelected = false;

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
      drawObjects(ctxD,serverPlanets);
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
    drawObjects(ctxD,serverPlanets);

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
    drawTimerMessage(params[5],serverTimers);
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
    self.mouseevent1 = new Mouseevent(canvasUI,ctxU,GAME_SETTINGS);
  },

  initialize: function(canvasStatic,canvasDynamic,canvasUI,ctxS,ctxD,ctxU,socket,GAME_SETTINGS){
    this.misc(canvasUI,ctxU,GAME_SETTINGS);
    ctxU.clearRect(0,0,GAME_SETTINGS.WIDTH,GAME_SETTINGS.HEIGHT);
    playing.mouseevent1.initialize();


    mainLoop = playing.loop;
  },

  loop: function(){
    clearBackground(params[4],params[7]);
    if(playing.mouseevent1.drag){
      playing.mouseevent1.draw();
    }

    for(var objectPlanet in serverPlanets){
      var objP = serverPlanets[objectPlanet];
      Drawobjects.drawPlanets(params[4],objP);
      if(objP.playerid === params[6].id){
        if(planetDynamicRectIntersect(objP,playing.mouseevent1)){
          Drawobjects.drawStartPlanetBorder(params[4],objP);
          currentPlanets = objP;
          isStartPlanetSelected = true;
        }else{
          isStartPlanetSelected = false;
        }
      }
    }

    if(!playing.mouseevent1.drag && isStartPlanetSelected){
      for(var objectPlanet in serverPlanets){
        var objP = serverPlanets[objectPlanet];
        if(planetMouseIntersect(objP,playing.mouseevent1)){
          Drawobjects.drawEndPlanetBorder(params[4],currentPlanets,objP,params[6]);
          var setShipsCoordinates = [currentPlanets,objP];
          console.log(setShipsCoordinates);

          params[6].emit("setShipsCoordinates", setShipsCoordinates);
            //if(clicked on planet send ship!)
        }
      }
    }

    for(var objectShip in serverShips){
      var objS = serverShips[objectShip];
      Drawobjects.drawShips(params[4],objS);
      //console.log(objS);
    }
  },

  destroy: function(){}
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

module.exports = {start,waiting,ready,playing,backToOpeningScene,setServerPlanets,setServerTimerMessage,setServerShips};

//draw objects
function drawObjects(ctx,serverObjects){
  this.serverObjects = serverObjects;
  for(var objects in serverObjects){
    obj = serverObjects[objects];
    Drawobjects.drawPlanets(ctx,obj);
    //console.log(obj);
  }
}

function drawTimerMessage(ctx, serverObjects){
  this.serverObjects = serverObjects;
  for(var objects in serverObjects){
    obj = serverObjects[objects];
    Drawobjects.Timer(ctx,obj);
    //console.log(obj);
  }
}

//setServerData
function setServerPlanets(statuses){
  serverPlanets = [];
  this.statuses = statuses;
  for(var status in statuses){
    stat = statuses[status];
    if(stat.role === "grayzonePlanet" || stat.role === "playerPlanet"){
      serverPlanets.push(stat)
    }
  }
  //console.log(serverPlanets);
}

function setServerTimerMessage(statuses){
  serverTimers = [];
  this.statuses = statuses;
  for(var status in statuses){
    stat = statuses[status];
    serverTimers.push(stat)
    }
  //console.log(serverTimer);
}

function setServerShips(statuses){
  serverShips= [];
  this.statuses = statuses;
  for(var status in statuses){
    stat = statuses[status];
    if(stat.role === "ship"){
      serverShips.push(stat)
    }
  }
  //console.log(serverShips);
}

//misc functions
function clearBackground(ctx, GAME_SETTINGS){
  ctx.save();
  ctx.clearRect(0,0,GAME_SETTINGS.WIDTH,GAME_SETTINGS.HEIGHT);
  ctx.restore();
}

function planetDynamicRectIntersect(obj,dynamicrect){
  var rect = dynamicrect.rect;
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
  return dx*dx+dy*dy <= (circle.planetSize*circle.planetSize);
}

function planetMouseIntersect(obj,mouseevent){
  var circle = obj;
  var mousehover = mouseevent.mousehover;
  var dx = mousehover.startX - circle.x;
  var dy = mousehover.startY - circle.y;
  // console.log("mousehoverStartX: " + mousehover.startX);
  // console.log("mousehoverStartY: " + mousehover.startY);
  return dx*dx+dy*dy <= (circle.planetSize*circle.planetSize);
}

