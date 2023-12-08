import * as input from './input.js';
import * as utils from './utils.js';
import { Cell, EAST, INWARDS, NORTH, OUTWARDS, SOUTH, STOPPED, WEST } from './cell.js';
import { ABSENT, PRESENT } from './wall.js';
import { CELL_SIZE, Grid } from './Grid.js';


//get the canvas element
const canvas = document.getElementById("canvas");
//get the context of the canvas
const ctx = canvas.getContext("2d");
ctx.linejoin = "round";

//resize the canvas to fill browser window dynamically
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const detached = canvas.cloneNode();
const ctx2 = detached.getContext("2d");

console.log("we got the canvas and the context of the canvas, and resized it");
console.log("this is the canvas width => ", canvas.width);
console.log("this is the canvas height => ", canvas.height);

let grid = new Grid(canvas.width, canvas.height);


let counter = 0;
function animate(timestamp) {
  requestAnimationFrame(animate);
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx2.clearRect(0, 0, canvas.width, canvas.height);
  grid.update(ctx, ctx2);
  

  //!SECTION this is a very shity reset needs to reset smouthly from 
  //!SECTION normal lenght outwards back to original lenght inwards
  // if (counter == 1 && grid.grid[0][0].animation == STOPPED) {
  //   grid.reset();
  //   counter++;
  // }
  // grid.grid[0][0].draw(ctx, ctx2);
}

requestAnimationFrame(animate);