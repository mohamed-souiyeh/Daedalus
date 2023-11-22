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
canvas.width  = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

console.log("we got the canvas and the context of the canvas, and resized it");
console.log(canvas.width, canvas.height);

function torad(degrees) {
	return degrees * Math.PI / 180;
}

// ctx.fillStyle = "rgba(0, 0, 150, 0.5)";
// ctx.fillRect(50, 50, 50, 50);
ctx.fillStyle = "rgba(0, 190, 0, 0.5)";
ctx.fillRect(120, 100, canvas.width, canvas.height);
// ctx.fillStyle = "rgba(150, 0, 150, 0.5)";
// ctx.fillRect(300, 500, 50, 50);


// ctx.beginPath();
// ctx.moveTo(350, 350);
// ctx.lineTo(600, 400);
// ctx.lineTo(900, 300);
ctx.strokeStyle = "rgba(150, 0, 0, 0.5)";
// ctx.stroke();

const FPS = 120;
const DELTA = 1 / FPS;

// ctx.beginPath();
// ctx.arc(1000, 400, 40, torad(0), torad(200));
// ctx.stroke();
let mouse = {
	x: 0,
	y: 0,
};

window.addEventListener("mousemove", function(event) {
	mouse.x = event.x;
	mouse.y = event.y;
	// console.log("mouse moved", mouse);
});

let cercles = [];

for (let i = 0; i < 300; i++) {
	let cercle = {};
	
	cercle.r = (Math.random() * 20) + 15;
	cercle.or = cercle.r;
	cercle.x = Math.random() * (canvas.width - (cercle.r + (canvas.width * 0.2))) + (canvas.width * 0.2);
	cercle.y = Math.random() * (canvas.height - (cercle.r + (canvas.height * 0.2))) + (canvas.height * 0.2);
	cercle.color = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 1})`;
	
	// cercle.xvelocity = (Math.random() - 0.5) < 0 ? 200 * 1 : 200;
	// cercle.yvelocity = (Math.random() - 0.5) < 0 ? 200 * 1 : 200;
	cercle.xvelocity = Math.random() * 200;
	cercle.yvelocity = Math.random() * 200;
	
	
	cercle.xacceleration = cercle.xvelocity * 0;
	cercle.yacceleration = cercle.yvelocity * 4;
	cercle.draw = function() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r, torad(0), torad(360), false);
		ctx.fillStyle = this.color;
		// console.log(this.color);
		// ctx.stroke();
		ctx.fill();
	}

	cercle.update = function() {
		// console.log("updating");
		
		if (typeof(mouse.x) !== undefined && Math.sqrt(Math.pow(mouse.x - this.x, 2) + Math.pow(mouse.y - this.y, 2)) - this.r < 30) {
			if (this.r < this.or * 4)
				this.r += 4;
		}
		else if (this.r > this.or) {
			this.r -= 2;
		}

		// this.xacceleration = this.xacceleration * DELTA;
		// this.yacceleration = this.yacceleration * DELTA;
		
		this.xvelocity = this.xvelocity + (this.xacceleration * DELTA);
		this.yvelocity = this.yvelocity + (this.yacceleration * DELTA);

		
		this.x = this.x + (this.xvelocity * DELTA);
		this.y = this.y + (this.yvelocity * DELTA);
		// console.log("the velocity: ", this.xvelocity, this.yvelocity);
		// console.log("the acceleration: ", this.xacceleration, this.yacceleration);
		// console.log("coordinates: ", this.x, this.y);
		// this.color = `rgba(${(cercle.x / canvas.width) * 255}, ${(cercle.y / canvas.height) * 255}, ${(((cercle.x + cercle.y) / (canvas.width + canvas.height)) * 0)}, 1)`;
		// this.color = `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 1})`;
		if ((this.x + this.r > canvas.width && this.xvelocity > 0)) {
			// console.log("hit the wall x");
			this.xvelocity = -this.xvelocity;
			this.x = canvas.width - this.r;
		}
		if (this.x - this.r < 0 && this.xvelocity < 0) {
			this.xvelocity = -this.xvelocity;
			this.x = this.r;
		}
		
		if ((this.y + this.r > canvas.height && this.yvelocity > 0)){
			// console.log("hit the wall y");
			this.yvelocity = -this.yvelocity;
			this.y = canvas.height - this.r;
		}
		if (this.y - this.r < 0 && this.yvelocity < 0) {
			this.yvelocity = -this.yvelocity;
			this.y = this.r;
		}
		this.draw();
	}
	cercles.push(cercle);
}


function draw() {
	
	
	
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	// ctx.fillStyle = "rgba(0, 0, 0, 1)";
	// ctx.fillRect(0, 0, canvas.width, canvas.height);

	for (i = 0; i < cercles.length; i++) {
		cercles[i].update();
	}

	requestAnimationFrame(draw);
}

draw();

// class Cell {

// }