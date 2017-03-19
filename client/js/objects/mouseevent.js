function Mouseevent(canvas,ctx,GAME_SETTINGS){
	this.canvas = canvas;
	this.ctx = ctx;
	this.GAME_SETTINGS = GAME_SETTINGS;
	this.rect = {};
	this.mousehover = {}
	this.drag = false;

	this.initialize = function(){
		if(this.setEvents){
	      this.setEvents();
	    }
	};

	this.setEvents = function(){
		rectObject = this;

		$(canvas).on('mousedown',function(e){
			switch (event.which){
				case 1:
					rectObject.mouseDown(e);
					break;
			}
		});

		// $(canvas).on('mouseover',function(e){
  //  			rectObject.mouseOver(e);
  //  		});

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
		//console.log("rect_startX: " + this.rect.startX);
		//console.log("rect_startY: " + this.rect.startY);
		}
		this.drag = true;
	};

	this.mouseMove = function(e){
		if(this.drag && e.type == 'mousemove'){
			this.rect.w = e.offsetX - this.rect.startX;
			this.rect.h = e.offsetY - this.rect.startY;
			console.log("rectdragW: "+ this.rect.w)
			console.log("rectdragH: "+ this.rect.h)
		}else{
			this.mousehover.startX = e.offsetX;
			this.mousehover.startY = e.offsetY;
			// console.log("mousehoverStartX: "+ this.mousehover.startX);
			// console.log("mousehoverStartY: "+ this.mousehover.startY);
		}
	};

	this.mouseOver =function(e){
		this.rect.startX = e.offsetX;
		this.rect.startY = e.offsetY;
	}

	this.mouseUp = function(){
		ctx.clearRect(0,0,GAME_SETTINGS.WIDTH,GAME_SETTINGS.HEIGHT);
		this.drag = false;
	};

	this.draw = function(){
		//CLEARRECT SHOULD NOT BE HERE! IT MESSES WITH THE CIRCLES AND DRAWING!!!!!!! VERY IMPORTANT!
		ctx.clearRect(0,0,GAME_SETTINGS.WIDTH,GAME_SETTINGS.HEIGHT);
		ctx.strokeStyle = '#000000';
		ctx.strokeRect(this.rect.startX, this.rect.startY, this.rect.w, this.rect.h);
	};
}

module.exports = Mouseevent;