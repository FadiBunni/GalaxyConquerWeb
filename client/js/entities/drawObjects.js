function drawObjects(ctx,status){
	switch(status.shape){
	  case "circle":
	  	var status = status.cic;
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
	    break;
	}
}

module.exports = drawObjects;
