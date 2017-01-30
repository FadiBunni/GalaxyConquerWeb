(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const cUtils = require('./utils/canvas.js');
const STATES = require('./utils/STATES.js');
var GAME_SETTINGS = null;
var Interval = 10;

const socket = io();

var ctx = canvas.getContext('2d');

socket.on('connected', function(SERVER_GAME_SETTINGS){
	GAME_SETTINGS = SERVER_GAME_SETTINGS;
	const canvas = cUtils.generateCanvas(GAME_SETTINGS.WIDTH, GAME_SETTINGS.HEIGHT);
	STATES.start.initialize(canvas,ctx,GAME_SETTINGS);
});
},{"./utils/STATES.js":2,"./utils/canvas.js":3}],2:[function(require,module,exports){
const img = require('./imgimport.js');

var start = {
  initialize: function(canvas,ctx,GAME_SETTINGS){
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
},{"./imgimport.js":4}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
module.exports = {
	imgImport: function(imgName,ctx){
		var img = new Image();
		img.src = 'client/img/' + imgName + '.jpg';
		img.onload = function(){
			ctx.drawImage(img,0,0);
		}
	}
};

},{}]},{},[1]);
