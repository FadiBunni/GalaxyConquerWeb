function Dynamicrect(){
	var rect = {};
	var drag = false;

	this.initialize = function(canvas,ctx,GAME_SETTINGS){
		this.canvas = canvas;
		this.ctx = ctx;
		this.GAME_SETTINGS = GAME_SETTINGS;

		if(this.setEvents){
	      this.setEvents(canvas);
	    }
	};

	this.setEvents = function(canvas){
		rectObject = this;

		$(canvas).on('mousedown',function(e){
			rectObject.mouseDown(e)
		});

		$(canvas).on('mousemove',function(e){
      		rectObject.mouseMove(e);
   		});

   		$(canvas).on('mouseup',function(e){
			rectObject.mouseUp(e)
		});
	};

	this.mouseDown = function(e){
		rect.startX = e.pageX - this.offsetLeft;
		rect.startY = e.pageY - this.offsetTop;
		console.log("rect_startX: " + rect.startX);
		console.log("rect_startY: " + rect.startY);
		drag = true;
	};

	this.mouseMove = function(e){
		if(e.type == 'mousemove'){
			var x = e.offsetX;
       		var y = e.offsetY;
       		console.log(x);
		}
		// if(drag){
		// 	rect.w = (e.pageX - this.offsetLeft) - rect.startX;
		// 	rect.h = (e.pageY - this.offsetTop) - rect.startY;
		// 	this.ctx = clearRect(0,0,this.GAME_SETTINGS.WIDTH,this.GAME_SETTINGS.HEIGHT);
		// }
	};

	this.mouseUp = function(e){
		drag = false;
		this.ctx = clearRect(0,0,this.GAME_SETTINGS.WIDTH,this.GAME_SETTINGS.HEIGHT);
	};

	this.draw = function(){
		this.ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
	};
}

module.exports = Dynamicrect;

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top
    };
}