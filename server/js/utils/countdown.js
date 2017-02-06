const SETTINGS = require("./SETTINGS.js");
const Baseobject = require("./baseobject.js");

function Countdown(count,xPos,yPos,size){
  Baseobject.call(this);
  this.defaultCount = count?count:10;
  this.defaultSize = size?size:40;
  this.createdAt = Date.now();
  this.status.shape = "text";
  this.status.text = {
    color : {fill:"#123456",stroke:"#ffffff"},
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
    if(this.status.text.message != count && count >= 0){
      this.status.text.size = this.defaultSize;
      this.status.text.message = count;
    } else {
      this.status.text.size *= 0.997;
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