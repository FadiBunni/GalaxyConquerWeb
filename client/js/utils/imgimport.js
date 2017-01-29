module.exports = {
	imgImport: function(imgName,ctx){
		var img = new Image();
		img.src = 'client/img/' + imgName + '.jpg';
		img.onload = function(){
			ctx.drawImage(img,0,0);
		}
	}
};
