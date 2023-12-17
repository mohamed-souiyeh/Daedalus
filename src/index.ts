import { Grid } from "./grid.js";
import { CellAnimation } from "./cell.js";
import { wallState } from "./wall.js";



const canvas = document.getElementById('canvas') as HTMLCanvasElement;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;

const grid = new Grid(canvas.width, canvas.height, wallState.PRESENT);


let counter = 0;
function animation(deltaTime: number) {
  requestAnimationFrame(animation);

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  grid.update(ctx, deltaTime);

  if (counter === 0 && grid.at(0, 0)?.getAnimation() === CellAnimation.STOPPED) {
    let randomCell = grid.randomCell();

    if (randomCell === null) return;

    let cellneighbors = randomCell.neighbors();

    for (let cell of cellneighbors) {
      randomCell.link(cell);
    }

    randomCell = grid.randomCell();

    if (randomCell === null) return;

    cellneighbors = randomCell.neighbors();

    for (let cell of cellneighbors) {
      randomCell.unlink(cell);
    }

    // counter++;
  }
}

requestAnimationFrame(animation);