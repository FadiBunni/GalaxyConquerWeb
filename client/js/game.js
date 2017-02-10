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