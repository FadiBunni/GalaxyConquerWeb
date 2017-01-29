const img = require('./imgimport.js');

var start = {
  initialize: function(canvas,ctx,GAME_SETTINGS){
  	ctx.fillStyle = 'black';
  	ctx.fillRect(0,0,GAME_SETTINGS.WIDTH,GAME_SETTINGS.HEIGHT);
  	img.imgImport('spaceship',ctx);
  },

  loop: function(){
  },

  destory:function(){
  },

  toWait: function(){
  }
};

var waiting = {
  initialize: function(){},
  loop: function(){},
  destory:function(){},
};

var ready = {
  initialize: function(){},
  loop: function(){},
  destory:function(){},
};

var playing = {
  initialize: function(){},
  loop: function(){},
  destory:function(){},
};

module.exports = {start,waiting,ready,playing};