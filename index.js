document.addEventListener("DOMContentLoaded", function () {
        // Get the select elements and the button
        let mazeAlgorithmSelect = document.getElementById("build");
        let solveAlgorithmSelect = document.getElementById("solve");
        let launchButton = document.getElementById("launch");

        //? window.addEventListener("resize", resizeCanvas);

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

function resizeCanvas() {
	let canvas = document.getElementById("canvas");
	// let ctx = canvas.getContext("2d");
	
	// Create an offscreen canvas and draw the current content onto it
	// let offscreenCanvas = document.createElement("canvas");
	// offscreenCanvas.width = canvas.width;
	// offscreenCanvas.height = canvas.height;
	// offscreenCanvas.getContext("2d").drawImage(canvas, 0, 0);
	
	
  // Resize the original canvas
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  // Draw the content from the offscreen canvas back onto the original canvas
//   ctx.drawImage(offscreenCanvas, 0, 0, canvas.width, canvas.height);
  console.log("resized canvas");
}


//get the canvas element
let canvas = document.getElementById("canvas");
//get the context of the canvas
let ctx = canvas.getContext("2d");

//resize the canvas to fill browser window dynamically
// canvas.width  = canvas.offsetWidth;
// canvas.height = canvas.offsetHeight;


function draw() {

	console.log("we got the canvas and the context");
	
	ctx.fillStyle = "#000000";
	
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	
	ctx.fillStyle = "#ff0000";
	
	console.log(canvas.width, canvas.height);

	ctx.fillRect(0, 0, 50, 50);
}

draw();

// class Cell {

// }