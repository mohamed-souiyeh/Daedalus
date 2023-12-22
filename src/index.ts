import { Grid } from "./grid.js";
import { Cell, CellAnimation, Directions } from "./cell.js";
import { wallState } from "./wall.js";
import { mouse } from "./input.js";



const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

console.log("canvas => ", canvas);
console.log("canvas offset width => ", canvas.offsetWidth);
console.log("canvas offset height => ", canvas.offsetHeight);
console.log("canvas width => ", canvas.width);
console.log("canvas height => ", canvas.height);

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const grid = new Grid(canvas.width, canvas.height, wallState.PRESENT);
const cell = new Cell();

cell.init(0, 0, 600, 200, 50, wallState.PRESENT);

let counter = 0;
function animation(deltaTime: number) {
  requestAnimationFrame(animation);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  grid.update(ctx, deltaTime);

  if (counter === 0 && grid.at(0, 0)?.getAnimation() === CellAnimation.STOPPED) {
    let randomCell = grid.randomCell();
    // let randomCell = grid.at(10, 10);

    if (randomCell === null) return;

    let cellneighbors = randomCell.neighbors();

    for (let cell of cellneighbors) {
      randomCell.link(cell);
    }

    // randomCell = grid.randomCell();

    // if (randomCell === null) return;

    // cellneighbors = randomCell.neighbors();

    // for (let cell of cellneighbors) {
    //   randomCell.unlink(cell);
    // }
  }
  
  
  ctx.fillStyle = "red";


  // console.log("mouse => ", mouse);
  //draw a cercle at the mouse position
  ctx.beginPath();
  ctx.arc(mouse.x - canvas.offsetLeft, mouse.y - canvas.offsetTop, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.closePath();

  // cell.update(1 / 60);
  // cell.draw(ctx);

  // if (counter === 0 && cell.getAnimation() === CellAnimation.STOPPED) {
  //   // cell.setOutwardAnimation();
  //   cell.setWallState(Directions.NORTH, wallState.ABSENT);
  //   cell.setWallState(Directions.EAST, wallState.ABSENT);
  //   cell.setWallState(Directions.SOUTH, wallState.ABSENT);
  //   // cell.setWallState(Directions.WEST, wallState.ABSENT);


  //   // counter++;
  // }
}

requestAnimationFrame(animation);