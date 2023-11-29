import * as input from './input.js';
import * as utils from './utils.js';
import { Cell, INWARDS, OUTWARDS, STOPPED } from './cell.js';


//get the canvas element
let canvas = document.getElementById("canvas");
//get the context of the canvas
let ctx = canvas.getContext("2d");

//resize the canvas to fill browser window dynamically
canvas.width  = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

console.log("we got the canvas and the context of the canvas, and resized it");
console.log(canvas.width, canvas.height);

let refreshRate = {
  FPS: 0,
  DELTA: 0
};

// refreshRate.FPS = await utils.determineFrameRate();


// console.log("this is the FPS = >", FPS);


// console.log("this is the delta = >", DELTA);

// async function test() {
//   let s = 0;
//   while (refreshRate.FPS == 0) {
//     s++;
//     console.log("s = >", s);
//     if (s == 100) {
//       break;
//     }
//   }
//   refreshRate.DELTA = 1 / refreshRate.FPS;
//   return refreshRate;
// }

// refreshRate = await test();

// console.log("this is the refreshRate = >", refreshRate);



let cell  = new Cell(0, 0, 100, 100, 50);
// let cell1 = new Cell(0, 0, 150, 100, 50);
// let cell2 = new Cell(0, 0, 200, 100, 50);
// let cell3 = new Cell(0, 0, 250, 100, 50);
// let cell4 = new Cell(0, 0, 300, 100, 50);
// let cell5 = new Cell(0, 0, 350, 100, 50);

let counter = 0;

function animate() {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  cell.update(ctx);
  // cell.draw(ctx);
  if (cell.animation == STOPPED)
    cell.animation = OUTWARDS;
  // if (counter > 0)
  //   cell1.update(ctx);
  // if (counter > 10)
  //   cell2.update(ctx);
  // if (counter > 15)
  //   cell3.update(ctx);
  // if (counter > 20)
  //   cell4.update(ctx);
  // if (counter > 25)
  //   cell5.update(ctx);
  counter++;
}

animate();