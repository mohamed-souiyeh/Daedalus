export let mouse = {
	x: 0,
	y: 0,
};

document.addEventListener("DOMContentLoaded", function () {
	// Get the select elements and the button
	let mazeAlgorithmSelect = document.getElementById("build");
        let solveAlgorithmSelect = document.getElementById("solve");
        let launchButton = document.getElementById("launch");
		
        //? window.addEventListener("resize", resizeCanvas);
		
		//add event listener to the mouse move event
		window.addEventListener("mousemove", function(event) {
			mouse.x = event.x;
			mouse.y = event.y;
			// console.log("mouse moved", mouse);
		});


        // Add an event listener to the mazeAlgorithm select
        mazeAlgorithmSelect.addEventListener("change", function () {
          // Enable the solveAlgorithm select when a maze algorithm is selected
          solveAlgorithmSelect.disabled = false;
          checkSelections();
        });

        // Add an event listener to the solveAlgorithm select
        solveAlgorithmSelect.addEventListener("change", function () {
          checkSelections();
        });

        function checkSelections() {
          // If both selects have a value, enable the button
          if (mazeAlgorithmSelect.value && solveAlgorithmSelect.value) {
            launchButton.disabled = false;
          }
        }
        // resizeCanvas();
    });
	
/*// function resizeCanvas() {
// 	let canvas = document.getElementById("canvas");
// 	// let ctx = canvas.getContext("2d");
	
// 	// Create an offscreen canvas and draw the current content onto it
// 	// let offscreenCanvas = document.createElement("canvas");
// 	// offscreenCanvas.width = canvas.width;
// 	// offscreenCanvas.height = canvas.height;
// 	// offscreenCanvas.getContext("2d").drawImage(canvas, 0, 0);
	
	
//   // Resize the original canvas
//   canvas.width = canvas.offsetWidth;
//   canvas.height = canvas.offsetHeight;

//   // Draw the content from the offscreen canvas back onto the original canvas
// //   ctx.drawImage(offscreenCanvas, 0, 0, canvas.width, canvas.height);
//   console.log("resized canvas");
// }*/

