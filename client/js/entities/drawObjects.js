function drawObjects(ctx,status){
  console.log(status);
	switch(status.shape){
	  case "circle":
	  	var status = status.cic;
	  	drawPlanets(ctx,status);
	    break;
	  case "text":
      var status = status.text;
	  	drawText(ctx,status);
	    break;
	}
}

function drawPlanets(ctx, status){
	ctx.save();
    ctx.fillStyle = status.color;
    ctx.globalAlpha = 0.85;
    ctx.beginPath();
    ctx.arc(status.x,status.y,status.planetSize,0,2*Math.PI);
    ctx.stroke();
    ctx.fill();
    ctx.textBaseline="middle";
    ctx.textAlign = 'center';
    ctx.fillStyle = "white";
    ctx.font = "16px verdana";
    ctx.fillText(status.planetScoreNumber,status.x,status.y);
    ctx.restore();
}

function drawText(ctx, status){
  if(!status.color) return;
  ctx.clearRect(status.x-23,status.y-25,49,45);
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
  ctx.restore();
}

module.exports = drawObjects;
