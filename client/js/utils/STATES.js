const Img    = require('./imgimport.js');
const Button = require('./button.js');
const Text   = require('./text.js');

var INTERVAL = 10;
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
    }
  },

  initialize: function(canvas,ctx,socket,GAME_SETTINGS){
    //Run misc() to get all function inside it.
  	this.misc(canvas,ctx,socket,GAME_SETTINGS);
    Img.imgImport('spaceship',ctx);
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
          default: {fill:"#FF0000", stroke:"#FF0000"},
          mouseover: {fill:"#FF0000", stroke: "#FF0000"}
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
          default: {fill:"#66CDAA", stroke:"#000080"},
          mouseover: {fill:"#FFFFFF", stroke:"#FF0000"}
        }
      },
      animation: {
        maxCount: 100,
        count: 0,
        dir: 1,
      }
    });
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
    this.destroy();
    socket.emit('waiting');
    ctx.restore();
    waiting.initialize(canvas,ctx,socket,GAME_SETTINGS);
  }
};

var waiting = {
  misc: function(){
    var self = this;
    self.text1 = new Text();
    self.text1.update = function(){
      var text = this.data.text;
      var animation = this.data.animation;
      animation .count += animation.dir;
      if(animation.count <= 0 || animation.count >= animation.maxCount){
        animation.dir *= -1;
      }
      text.globalAlpha = 0.2 + 0.7*(animation.count/1000);
    }
  },

  initialize: function(canvas,ctx,socket,GAME_SETTINGS){

    this.misc();
    waiting.text1.initialize(canvas,ctx,GAME_SETTINGS, {
      text:{
        x: undefined,
        y: undefined,
        size: 30,
        font: "Arial",
        textBaseline: "middle",
        textAlign: "center",
        lineWidth: 2,
        message: "WAITING FOR OPPONENT..",
        globalAlpha: undefined,
        color: {fill: undefined, stroke: undefined},
        colorData: {
          default: {fill: "#FFFFFF", stroke: undefined}
        }
      },
      animation: {
        maxCount: 100,
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

  destroy:function(){

  }
};

var ready = {
  initialize: function(){},
  loop: function(){},
  destroy:function(){}
};

var playing = {
  initialize: function(){},
  loop: function(){},
  destroy:function(){}
};

module.exports = {start,waiting,ready,playing};

function drawBackground(ctx,globalAlpha,color){
    ctx.save();
    ctx.globalAlpha = globalAlpha!==undefined?globalAlpha:1;
    ctx.fillStyle = color?color:GAME_SETTINGS.BACKGROUND_COLOR;
    ctx.fillRect(0,0,GAME_SETTINGS.WIDTH,GAME_SETTINGS.HEIGHT);
    ctx.restore();
}