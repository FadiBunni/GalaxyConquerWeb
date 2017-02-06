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