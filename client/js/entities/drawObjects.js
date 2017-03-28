var drawObjects = {
  drawPlanets: function(ctx,status){
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

  drawShips: function(ctx,status){
    switch(status.role){
      case "ship":
        drawShips(ctx,status);
        break;
    }
  },

  drawStartPlanetBorder: function(ctx,status){
    switch (status.role){
      case "playerPlanet":
        //console.log('heeey');
        drawStartPlanetBorder(ctx,status);
        break;
    }
  },

  drawEndPlanetBorder: function(ctx,currentstatus,status,socket){
    drawEndPlanetBorder(ctx,currentstatus,status,socket);
  },

  Timer: function(ctx,status){
    switch(status.role){
      case "countdown":
        //console.log('countdown');
        drawTimerText(ctx,status);
        break;
    }
  }
};

module.exports = drawObjects;

function drawPlanets(ctx,status){
  ctx.save();
  ctx.fillStyle = status.color;
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.arc(status.x,status.y,status.planetSize,0,2*Math.PI);
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

function drawShips(ctx,status){
  //The triangle
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(status.xPos + (15*Math.cos(1)),status.yPos + (15*Math.sin(1)));
  ctx.lineTo(status.xPos - (5*Math.sin(1)),status.yPos + (5*Math.cos(1)));
  ctx.lineTo(status.xPos + (5*Math.sin(1)),status.yPos - (5*Math.cos(1)));
  ctx.closePath();
  //The outline
  ctx.lineWidth =1;
  ctx.strokeStyle = 'black';
  ctx.stroke();
  //the fill color
  ctx.fillStyle = status.color;
  ctx.fill();
  ctx.restore();
}

function drawStartPlanetBorder(ctx,status){
    ctx.save();
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.arc(status.x,status.y,status.planetSize+1,0,2*Math.PI);
    ctx.stroke();
}

function drawLineBetweenPlanets(ctx,currentstatus,status,socket){
  ctx.beginPath();
  ctx.lineWidth="5";
  ctx.strokeStyle="white";
  ctx.moveTo(status.x,status.y);
  //console.log(status.x);
  ctx.lineTo(currentstatus.x,currentstatus.y);
  //console.log(currentstatus.x);
  ctx.stroke();

}

function drawEndPlanetBorder(ctx,currentstatus,status,socket){

    //console.log(status);
    ctx.save();
    ctx.strokeStyle = 'blue';
    ctx.beginPath();
    ctx.lineWidth = 4;
    ctx.arc(status.x,status.y,status.planetSize+3,0,2*Math.PI);
    ctx.stroke();
    drawLineBetweenPlanets(ctx,currentstatus,status,socket);
}

function drawTimerText(ctx, status){
  if(!status.color) return;
  ctx.clearRect(status.x-32,status.y-22,64,42);
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


