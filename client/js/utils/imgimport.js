function imgImport(imgName,ctx){
	var img = new Image();
	img.onload = function(){
		ctx.drawImage(img,0,0);
	};
	img.src = 'client/img/' + imgName + '.jpg';
}

module.exports = imgImport;
