import * as input from './input.js';
import * as utils from './utils.js';
import { Cell } from './cell.js';


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


let cell = new Cell(0, 0, 300, 300, 100);
let cell2 = new Cell(0, 0, 100, 100, 100);

cell.draw(ctx);
cell2.draw(ctx);