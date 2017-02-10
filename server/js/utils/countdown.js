const SETTINGS = require("./SETTINGS.js");
const Baseobject = require("./baseobject.js");

function Countdown(count,xPos,yPos,size){
  Baseobject.call(this);
  this.defaultCount = count?count:10;
  this.defaultSize = size?size:40;
  this.createdAt = Date.now();
  this.role = "countdown";
  this.status.count = {
    role:this.role,
    color : {fill:"#123456",stroke: undefined},
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