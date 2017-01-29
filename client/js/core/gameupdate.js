 function gameUpdate(scope) {
 	this.update = function(tFrame){
 		var state = scope.state || {};

 		//if there are entities, iterate through then and call their 'update' methods
 		if(state.hasOwnProperty('entities')) {
 			var entities = state.entities;
 			//loop through entities
 			for(var entity in entities){
 			// fire off each active entities 'render' method
 			entities[entity].update();
 			}
 		}
 		return state;
 	}
 	return this.update;
 }

 module.exports = gameUpdate;