import { Grid } from "./grid.js";
import { Cell, CellAnimation, Directions } from "./cell.js";
import { wallState } from "./wall.js";
import { mouse } from "./input.js";
import { DeltaTime } from "./deltaTime.js";


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

let counter = 0;
let deltaTime: DeltaTime = new DeltaTime();


function animation(dt: number) {
  requestAnimationFrame(animation);


  if (deltaTime.lastTime === 0) {
    deltaTime.lastTime = dt;
  }

  deltaTime.update(dt);

  if (deltaTime.oneStepIsDone()) {
    grid.update(ctx);
    
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
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  grid.draw(ctx);

  if (deltaTime.oneDebugStepIsDone()) {
    grid.updateDebuger(ctx);
  }
}

requestAnimationFrame(animation);