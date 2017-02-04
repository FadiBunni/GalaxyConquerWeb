function drawObjects(ctx,status){
	switch(status.shape){
	  case "circle":
	  	var status = status.cic;
	  	console.log(status);
	    ctx.fillStyle = status.color;
	    ctx.beginPath();
	    ctx.arc(status.x,status.y,status.planetSize,0,2*Math.PI);
	    ctx.stroke();
	    ctx.fill();
	    break;
	}
}

module.exports = drawObjects;
