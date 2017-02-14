function Dynamicrect(canvas,ctx,GAME_SETTINGS){
	this.canvas = canvas;
	this.ctx = ctx;
	this.GAME_SETTINGS = GAME_SETTINGS;
	var rect = {};
	var drag = false;

	this.initialize = function(){
		if(this.setEvents){
	      this.setEvents();
	    }
	};

	this.setEvents = function(){
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
		rect.w = null;
		rect.h = null;
		if(e.type == 'mousedown'){
		rect.startX = e.offsetX;
		rect.startY = e.offsetY;
		// console.log("rect_startX: " + rect.startX);
		// console.log("rect_startY: " + rect.startY);
		}
		drag = true;
	};

	this.mouseMove = function(e){
		if(drag && e.type == 'mousemove'){
			rect.w = e.offsetX - rect.startX;
			rect.h = e.offsetY - rect.startY;
			// console.log("rectdragW: "+ rect.w)
			// console.log("rectdragH: "+ rect.h)
			ctx.clearRect(0,0,GAME_SETTINGS.WIDTH,GAME_SETTINGS.HEIGHT);
			this.draw();
		}
	};

	this.mouseUp = function(){
		ctx.clearRect(0,0,GAME_SETTINGS.WIDTH,GAME_SETTINGS.HEIGHT);
		drag = false;
	};

	this.draw = function(){
		ctx.strokeStyle = '#000000';
		ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
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