const Text = new (require('./text.js'));

function Button(canvas,ctx,GAME_SETTINGS,data) {
	this.events = {};

	this.initialize = function(canvas, ctx, GAME_SETTINGS, data){
    //Text.initialize.call(this, canvas, ctx, GAME_SETTINGS, data);

    Text.initialize.call(this,canvas, ctx, GAME_SETTINGS, data);

    var rect = data.rect;
    var text = data.text;
    rect.x = rect.x?rect.x:GAME_SETTINGS.WIDTH/2;
    rect.y = rect.y?rect.y:GAME_SETTINGS.HIGHT/2;
    rect.color=rect.colorData.default
    if(this.setEvents){
      this.setEvents(canvas);
    }
  };

	this.setEvents = function(canvas){
    //This is declared as a n global obtject, try to add 'var' later. 
    buttonObject = this;

    $(canvas).on('click', function(e){
      if(buttonObject.data){
        var rect = buttonObject.data.rect;
        if(pointSquareCollisionCheck(e.offsetX, e.offsetY, rect)){
          buttonObject.click();
        }
      }
    });

    $(canvas).on('mousemove',function(e){
      buttonObject.mousemove(e);
    });

    canvas.addEventListener("touchstart",this.events.touchstart);
    canvas.addEventListener("touchmove",this.events.touchmove);
    canvas.addEventListener("touchend",this.events.touchend);
  };

	this.events.touchstart = function(e){
    e.preventDefault();
    buttonObject.mousemove(e);
  };

	this.events.touchmove  = function(e){
    buttonObject.mousemove(e);
  };

	this.events.touchend   = function(e){
    var x = e.changedTouches[0].clientX-e.changedTouches[0].target.offsetLeft;
    var y = e.changedTouches[0].clientY-e.changedTouches[0].target.offsetTop;
    var rect = buttonObject.data.rect;
    if(pointSquareCollisionCheck(x,y,rect)){
      buttonObject.click();
    }
  };

  this.mousemove = function(e){
    if(this.data){
      var x,y;
      if(e.type == 'mousemove'){
        x = e.offsetX;
        y = e.offsetY;
      } else {
        x = e.changedTouches[0].clientX-e.changedTouches[0].target.offsetLeft;
        y = e.changedTouches[0].clientY-e.changedTouches[0].target.offsetTop;
      }
      var rect = this.data.rect;
      var text = this.data.text;
      var mouseover = pointSquareCollusionCheck(x, y, rect);

      rect.color = mouseover?rect.colorData.mouseover:rect.colorData.default;
      text.color = mouseover?text.colorData.mouseover:text.colorData.default;
    }
  };
}

module.exports = Button;

function pointSquareCollisionCheck(x,y,square){
  if(x >= square.x-square.width/2 && x <= square.x+square.width/2 && y >= square.y-square.height/2 && y <= square.y+square.height/2 )
    return true;
}

function drawRect(ctx, rect){
  if(!rect.color) return;
  ctx.save();
  ctx.beginPath();

  ctx.globalAlpha = rect.globalAlpha!==undefined?rect.globalAlpha:1;
  if(rect.color.fill){
    ctx.fillStyle = rect.color.fill;
    ctx.fillRect(rect.x-rect.width/2,rect.y-rect.height/2,rect.width,rect.height);
  }
  if(rect.color.stroke){
    ctx.strokeStyle = rect.color.stroke;
    ctx.lineWidth = rect.lineWidth;
    ctx.rect(rect.x-rect.width/2,rect.y-rect.height/2,rect.width,rect.height);
    ctx.stroke();
  }
  ctx.restore();
}