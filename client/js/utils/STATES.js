const Drawobjects = require('../entities/drawObjects.js');
const Img    = require('./imgimport.js');
const Button = require('./button.js');
const Text   = require('./text.js');
const INTERVAL = 45;

var params = [];
var serverObjects = [];

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
  misc: function(socket,ctx,GAME_SETTINGS){
    var self = this;
    self.text1 = new Text();
    self.button1 = new Button();
    self.button1.click = function(){
      //set player to be ready.
      socket.emit('ready');
      ctx.clearRect(0,0,GAME_SETTINGS.WIDTH,GAME_SETTINGS.HEIGHT);
      Img('spaceship',ctx,function(){
        drawObjects(ctx,serverObjects);
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
  initialize: function(canvas,ctx,socket,GAME_SETTINGS){
    this.misc(socket,ctx,GAME_SETTINGS);
    ctx.clearRect(0,0,GAME_SETTINGS.WIDTH,GAME_SETTINGS.HEIGHT);
    Img('spaceship',ctx,function(){
      drawObjects(ctx,serverObjects);
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
    ready.update();
    if(ready.button1.data){
      ready.button1.update();
      ready.button1.draw();
    }
    ready.text1.draw();

  },

  update: function(){
    drawTimerMessage(params[1], serverObjects);
  },

  destroy:function(){
    $(canvas).off();
    canvas.removeEventListener("touchstart", ready.button1.events.touchstart);
    canvas.removeEventListener("touchmove", ready.button1.events.touchmove);
    canvas.removeEventListener("touchend", ready.button1.events.touchend);
  }
};

var playing = {
  misc: function(){

  },

  initialize: function(canvas,ctx,socket,GAME_SETTINGS){
    this.misc(socket,ctx,GAME_SETTINGS);
    ctx.clearRect(0,0,GAME_SETTINGS.WIDTH,GAME_SETTINGS.HEIGHT);
    Img('spaceship',ctx);




    mainLoop = playing.loop;
  },

  loop: function(){
    ready.update();
  },

  update: function(){
    //drawObjects(params[1],serverObjects);
  },

  destroy:function(){

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

  destroy: function(){}
};

module.exports = {start,waiting,ready,playing,backToOpeningScene,setServerObjects,setServerTimerMessage};

function drawObjects(ctx,serverObjects){
  this.serverObjects = serverObjects;
  for(objects in serverObjects){
    obj = serverObjects[objects];
    Drawobjects(ctx,obj);
  }
  //console.log(obj);
}

function drawTimerMessage(ctx, serverObjects){
  this.serverObjects = serverObjects;
  for(objects in serverObjects){
    obj = serverObjects[objects];
    Drawobjects(ctx,obj);
  }
  //console.log(obj);
}

function setServerObjects(statuses){
  this.statuses = statuses;
  for(status in statuses){
    stat = statuses[status];
    serverObjects.push(stat)
  }
  //console.log(serverObjects);
}

function setServerTimerMessage(statuses){
  serverObjects = [];
  this.statuses = statuses;
  for(status in statuses){
    stat = statuses[status];
    serverObjects.push(stat)
  };
  //console.log(serverObjects);
}