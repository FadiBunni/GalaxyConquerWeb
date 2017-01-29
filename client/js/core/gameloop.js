function gameLoop (scope) {
 	var loop = this;

 	// Initialize timer variables so we can calculate FPS
 	var fps = scope.constants.targetFps, // Our target fps
 		fpsInterval = 100 / fps, // the interval between animation tick, in ms (1000 / 60 = ~16.666667)
 		before = window.performance.now(), // The starting times timestamp.

 		// Set up an object to contain our alternating FPS calculations
 		cycles = {
 			new: {
 				frameCount: 0, // Frames since the start of the cycle
 				startTime: before,
 				sinceStart: 0
 			},
 			old: {
 				frameCount: 0,
 				startTime: before,
 				sinceStart: 0
 			}
 		},

 		// alternating Frame Rate variables
 		resetInterval = 5, // Frame rate cycle reset interval (in seconds)
 		resetState = 'new'; // The initial frame rate cycle

 	loop.fps = 0; // A prop that will expose the current calculated FPS to other modules

 	// Main game rendering loop
 	loop.main = function mainLoop(tframe){
 		// Request a new animation frame
 		// Setting to 'stopLoop' so animation can be stopped via
 		// 'window.cancelAnimationFrame(loop.stopLoop)'
 		loop.stopLoop = window.requestAnimationFrame(loop.main);

 		// How long ago since last loop?
 		var now = tframe,
 			elapsed = now - before,
 			activeCycle, targetResetInterval;

 		// If it's been at least our desired interval, render
 		if (elapsed > fpsInterval) {
 			// Set before = now for next frame, also adjust for
        	// specified fpsInterval not being a multiple of rAF's interval (16.7ms)
        	// ( http://stackoverflow.com/a/19772220 )
        	before = now - (elapsed % fpsInterval);

        	// Increment the vals for both the active and the alternate FPS calculations
        	for(var calc in cycles) {
        		++cycles[calc].frameCount;
        		cycles[calc].sinceStart = now - cycles[calc].startTime;
        	}

        	// choose the correct FPS calculation, then update the exposed fps value
        	activeCycle = cycles[resetState];
        	loop.fps = Math.round(1000 / (activeCycle.sinceStart / activeCycle.frameCount) * 100) / 100;

        	// If our frame counts are equal....
        	targetResetInterval = (cycles.new.frameCount === cycles.old.frameCount
        							? resetInterval * fps // Wait our interval
        							: (resetInterval * 2) * fps); // wait double our interval

        	// If the active calculation goes over our specified interval,
			// reset it to 0 and flag our alternate calculation to be active
			// for the next series of animations.

			if (activeCycle.frameCount > targetResetInterval) {
			    cycles[resetState].frameCount = 0;
			    cycles[resetState].startTime = now;
			    cycles[resetState].sinceStart = 0;

			    resetState = (resetState === 'new' ? 'old' : 'new');
			}

        	// Update the game state
	 		scope.state = scope.update(now);
	 		// Render the next frame
	 		scope.render();
 		}
 	};

 	// Start off main loop
 	loop.main();

 	return loop;
 }

 module.exports = gameLoop;