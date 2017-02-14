const Text = new (require('./text.js'));

function Button() {

	this.initialize = function(canvas, ctx, GAME_SETTINGS, data){
    //Text.initialize.call(this, canvas, ctx, GAME_SETTINGS, data);
    Text.initialize.call(this, canvas, ctx, GAME_SETTINGS, data);
    var rect = this.data.rect;
    var text = this.data.text;
    rect.x = rect.x?rect.x:text.x?text.x:GAME_SETTINGS.WIDTH/2;
    rect.y = rect.y?rect.y:text.y?text.y:GAME_SETTINGS.HEIGHT/2;
    rect.color=rect.colorData.default
    if(this.setEvents){
      this.setEvents(canvas);
    }
  };

	this.setEvents = function(canvas){
    //This is declared as an global object, try to add 'var' later.
    buttonObject = this;
    //console.log(buttonObject);
    $(canvas).on('click', function(e){
      if(buttonObject.data){
        //console.log('clicked');
        var rect = buttonObject.data.rect;
        if(pointSquareCollisionCheck(e.offsetX, e.offsetY, rect)){
          buttonObject.click();
        }
      }
    });

    $(canvas).on('mousemove',function(e){
      buttonObject.mousemove(e);
    });

  };

  this.mousemove = function(e){
    if(this.data){
      var x,y;
      if(e.type == 'mousemove'){
        x = e.offsetX;
        y = e.offsetY;
        //console.log("buttonX: " + x);
      } else {
        x = e.changedTouches[0].clientX-e.changedTouches[0].target.offsetLeft;
        y = e.changedTouches[0].clientY-e.changedTouches[0].target.offsetTop;
      }
      var rect = this.data.rect;
      var text = this.data.text;
      var mouseover = pointSquareCollisionCheck(x, y, rect);

      rect.color = mouseover?rect.colorData.mouseover:rect.colorData.default;
      text.color = mouseover?text.colorData.mouseover:text.colorData.default;
    }
  };

  this.draw = function() {
    if(!this.data) return;
      drawRect(this.ctx, this.data.rect);
      Text.draw.call(this);
  };
}

module.exports = Button;

function pointSquareCollisionCheck(x,y,square){
  if(x >= square.x-square.width/2 && x <= square.x+square.width/2 && y >= square.y-square.height/2 && y <= square.y+square.height/2 ){
    return true;
  }
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