const Img = require('./imgimport.js');
const Button = require('./button.js');

var start = {
  misc: function(){
    var self = this;
    self.button1 = new Button();
    self.button1.click = function(){
      start.toWait();
    };
    self.button1.update = function(){
      var text = this.data.text;
      var animation = this.data.animation;
      animation .count += animation.dir;
      if(animation.count <= 0 || animation.count >= animation.maxCount){
        animartion.dir *= -1;
      }
      text.globalAlpha = 0.2 + 0.7*(animation.count/1000);
    }
  },

  initialize: function(canvas,ctx,GAME_SETTINGS){
    //Run misc() to get all function inside it.
  	this.misc();
    //Img.imgImport('spaceship',ctx);
    console.log(this);
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
        color: {fill:undefined, stroke:undefined},
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
   
  },

  loop: function(){
  },

  destory:function(){
  },

  toWait: function(){
    console.log('heey');
  }
};

var waiting = {
  initialize: function(){},
  loop: function(){},
  destory:function(){}
};

var ready = {
  initialize: function(){},
  loop: function(){},
  destory:function(){}
};

var playing = {
  initialize: function(){},
  loop: function(){},
  destory:function(){}
};

module.exports = {start,waiting,ready,playing};