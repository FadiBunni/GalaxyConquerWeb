function imgImport(imgName,ctx,callback){
	var img = new Image();
	img.onload = function(){
		ctx.drawImage(img,0,0);
		if (callback) {
    		callback();
		}
	};
	img.src = 'client/img/' + imgName + '.jpg';
}

module.exports = imgImport;
