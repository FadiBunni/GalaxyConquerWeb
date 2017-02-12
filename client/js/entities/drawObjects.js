var drawObjects = {

  drawPlanets:function(ctx,status){
    //console.log(status);
    switch(status.role){
      case "grayzonePlanet":
        //console.log('grayzonePlanet');
        drawPlanets(ctx,status);
        break;
      case "playerPlanet":
        //console.log('playerPlanet');
        drawPlanets(ctx,status);
        break;
    }
  },

  timer: function(ctx,status){
    switch(status.role){
      case "countdown":
        //console.log('countdown');
        drawText(ctx,status);
        break;
    }
  }
};

module.exports = drawObjects;

function drawPlanets(ctx, status){
  ctx.save();
  ctx.fillStyle = status.color;
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.arc(status.x,status.y,status.planetSize,0,2*Math.PI);
  ctx.stroke();
  ctx.fill();
  drawTextOnPlanets(ctx,status);
  ctx.restore();
}

function drawTextOnPlanets(ctx,status){
  ctx.textBaseline="middle";
  ctx.textAlign = 'center';
  ctx.fillStyle = "white";
  ctx.font = "16px verdana";
  ctx.fillText(status.planetScoreNumber,status.x,status.y);
}

function drawText(ctx, status){
  if(!status.color) return;
  ctx.clearRect(status.x-19,status.y-17,40,33);
  //var imagedata = ctx.getImageData(status.x-17,status.y-17,40,33);
  ctx.save();
  ctx.beginPath();
  ctx.font = status.size+"px "+status.font;
  ctx.textAlign = status.textAlign;
  ctx.textBaseline = status.textBaseline;
  ctx.globalAlpha = status.globalAlpha!==undefined?status.globalAlpha:1;
  if(status.color.stroke){
    ctx.strokeStyle = status.color.stroke;
    ctx.lineWidth = status.lineWidth;
    ctx.strokeText(status.message, status.x, status.y);
  }
  if(status.color.fill){
    ctx.fillStyle = status.color.fill;
    ctx.fillText(status.message, status.x, status.y);
  }
  if(status.message == 0){
    ctx.clearRect(status.x-19,status.y-17,40,33);
  }
  //ctx.putImageData(imagedata, status.x-100,status.y);
  ctx.restore();
}


