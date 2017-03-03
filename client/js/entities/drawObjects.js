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
      case "Ships":
        drawShips(ctx,status);
        break;
    }
  },

  selectBorder: function(ctx,status,socket){
    switch (status.role){
      case "playerPlanet":
        //console.log('heeey');
        drawBorderPlanet(ctx,status,socket);
        break;
    }
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
  console.log("drawing!");
  //The triangle
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(100,100);
  ctx.lineTo(100,300);
  ctx.lineTo(150,300);
  ctx.closePath();
  //The outline
  ctx.lineWidth =1;
  ctx.strokeStyle = 'black';
  ctx.stroke();
  //the fill color
  ctx.fillStyle = "#FFCC00";
  ctx.fill();
  ctx.restore();
}

function drawBorderPlanet(ctx,status,socket){
  if(status.playerid === socket.id){;
    ctx.save();
    ctx.strokeStyle = 'white';
    ctx.beginPath();
    ctx.arc(status.x,status.y,status.planetSize+1,0,2*Math.PI);
    ctx.stroke();
  }
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


