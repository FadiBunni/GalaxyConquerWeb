const SETTINGS = require("./SETTINGS.js");
const Baseobject = require("./baseobject.js");

function Countdown(count,xPos,yPos,size,setColorDir){
  Baseobject.call(this);
  this.defaultCount = count?count:10;
  this.defaultSize = size?size:60;
  this.setColorDir = setColorDir;
  this.createdAt = Date.now();
  this.role = "countdown";
  this.status.count = {
    role:this.role,
    color : {fill:"#008000",stroke: undefined},
    font : "Arial",
    lineWidth : 10,
    textAlign : "center",
    textBaseline : "middle",
    size : this.defaultSize,
    message : this.defaultCount,
    x : xPos?xPos:SETTINGS.WIDTH/2,
    y : yPos?yPos:SETTINGS.HEIGHT/2
  };

  this.update = function(room){
    var count = this.defaultCount-Math.floor((Date.now()-this.createdAt)/1000);
    if(this.status.count.message != count && count >= 0){
      this.status.count.size = this.defaultSize;
      this.status.count.message = count;
    } else {
      this.status.count.size *= 0.997;
    }
    if(setColorDir === true){
      if(count <=3){
       this.status.count.color.fill = "#FF0000";
      }
    }
    if(setColorDir === false){
      this.status.count.color.fill = "#008000";
      if(count <=3){
        this.status.count.color.fill = "#FF0000";
      }
    }
    if(count<0){
      this.action(room);
    }
    return this;
  };

  this.action = function(room){
    return this;
  };
}
module.exports = Countdown;