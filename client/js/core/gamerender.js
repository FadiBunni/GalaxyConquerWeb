function gameRender(scope) {
	// Setup globals
	var w = scope.constants.width,
		h = scope.constants.height;

	this.render = function() {
	// clear out the canvas

	scope.ctx.clearRect(0, 0, w, h);

	this.ctx.fillStyle = "black";
	this.ctx.fillRect(0, 0, w, h);

		// if we want to show the FPS, then render it in the top right corner
		if(scope.constants.showFps){
			scope.ctx.fillStyle = '#ff0';
			scope.ctx.font = '18px Arial';
			scope.ctx.fillText('FPS: ' + scope.loop.fps, w - 120, 50);
		}

		// if there are entities iterate through them and call their 'render' methods.
		 if(scope.state.hasOwnProperty('entities')) {
			var entities = scope.state.entities;
			//loop through entities
			for(var entity in entities){
			// fire off each active entities 'render' method
			entities[entity].render();
			}
		}
	}
	return this.render;
}

 module.exports = gameRender;