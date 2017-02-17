function Dynamicrect(canvas,ctx,GAME_SETTINGS){
	this.canvas = canvas;
	this.ctx = ctx;
	this.GAME_SETTINGS = GAME_SETTINGS;
	this.rect = {};
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
		this.rect.w = null;
		this.rect.h = null;
		if(e.type == 'mousedown'){
		this.rect.startX = e.offsetX;
		this.rect.startY = e.offsetY;
		// console.log("rect_startX: " + this.rect.startX);
		// console.log("rect_startY: " + this.rect.startY);
		}
		drag = true;
	};

	this.mouseMove = function(e){
		if(drag && e.type == 'mousemove'){
			this.rect.w = e.offsetX - this.rect.startX;
			this.rect.h = e.offsetY - this.rect.startY;
			// console.log("rectdragW: "+ this.rect.w)
			// console.log("rectdragH: "+ this.rect.h)
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
		ctx.strokeRect(this.rect.startX, this.rect.startY, this.rect.w, this.rect.h);
	};
}

module.exports = Dynamicrect;