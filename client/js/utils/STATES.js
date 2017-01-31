const Img = require('./imgimport.js');
const Button = require('./button.js');

var INTERVAL = 10;
var mainLoop = function(){};
  var interval = setInterval(function(){
    mainLoop();
},INTERVAL);



var start = {
  misc: function(socket){
    var self = this;
    self.button1 = new Button();
    self.button1.click = function(){
      start.toWait(socket);
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
  	this.misc(socket);
    //console.log(data);
    //Img.imgImport('spaceship',ctx);
    //console.log(this);
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
          default: {fill:"#123456", stroke:undefined},
          mouseover: {fill:"#ddeeff", stroke:undefined}
        }
      },
      rect: {
        x: undefined,
        y: undefined,
        width: 230,
        height: 50,
        lineWidth: 2,
        color: {fill:'red', stroke:undefined},
        colorData: {
          default: {fill:"#1099cc", stroke:"#223344"},
          mouseover: {fill:"#0686e0", stroke:"#223344"}
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

  toWait: function(socket){
    this.destroy();
    socket.emit('waiting');
    console.log('heey');
  }
};

var waiting = {
  initialize: function(){},
  loop: function(){},
  destroy:function(){}
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