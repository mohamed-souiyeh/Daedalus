import * as input from './input.js';
import * as utils from './utils.js';
import { Cell, INWARDS, NORTH, OUTWARDS, SOUTH, STOPPED } from './cell.js';
import { ABSENT, PRESENT } from './wall.js';


//get the canvas element
let canvas = document.getElementById("canvas");
//get the context of the canvas
let ctx = canvas.getContext("2d");
ctx.linejoin = "round";

//resize the canvas to fill browser window dynamically
canvas.width  = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

console.log("we got the canvas and the context of the canvas, and resized it");
console.log(canvas.width, canvas.height);



let cell  = new Cell(0, 0, 100, 100, 100, PRESENT);
let cell1 = new Cell(0, 0, 200, 100, 100, PRESENT);
let cell2 = new Cell(0, 0, 300, 100, 100, PRESENT);
let cell3 = new Cell(0, 0, 400, 100, 100, PRESENT);
let cell4 = new Cell(0, 0, 500, 100, 100, PRESENT);
let cell5 = new Cell(0, 0, 600, 100, 100, PRESENT);

let counter = 0;

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  cell.update(ctx);
  if (counter == 0 && cell.animation == STOPPED){
    cell.walls[NORTH].setWallState(ABSENT);
    cell.setVelocityAnimation(OUTWARDS);
    counter++;
  }
  // cell1.update(ctx);
  // if (cell1.animation == STOPPED)
  //   cell1.setVelocityAnimation(OUTWARDS);
  // cell2.update(ctx);
  // if (cell2.animation == STOPPED)
  //   cell2.setVelocityAnimation(OUTWARDS);
  // cell3.update(ctx);
  // if (cell3.animation == STOPPED)
  //   cell3.setVelocityAnimation(OUTWARDS);
  // cell4.update(ctx);
  // if (cell4.animation == STOPPED)
  //   cell4.setVelocityAnimation(OUTWARDS);
  // cell5.update(ctx);
  // if (cell5.animation == STOPPED)
  //   cell5.setVelocityAnimation(OUTWARDS);
}

animate();