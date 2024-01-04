import { Grid } from "./grid.js";
import { DeltaTime } from "./deltaTime.js";
import { wallState } from "./configs/wall.config.js";
import { CellAnimation, CellStates } from "./configs/cell.config.js";
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
console.log("canvas => ", canvas);
console.log("canvas offset width => ", canvas.offsetWidth);
console.log("canvas offset height => ", canvas.offsetHeight);
console.log("canvas width => ", canvas.width);
console.log("canvas height => ", canvas.height);
canvas.width = canvas.offsetWidth;
canvas.height = canvas.offsetHeight;
const grid = new Grid(canvas.width, canvas.height, wallState.PRESENT);
let counter = 0;
let deltaTime = new DeltaTime();
function animation(dt) {
    requestAnimationFrame(animation);
    if (deltaTime.lastTime === 0) {
        deltaTime.lastTime = dt;
    }
    deltaTime.update(dt);
    if (deltaTime.oneStepIsDone()) {
        grid.update(ctx);
        if (counter === 0 && grid.at(0, 0)?.animation === CellAnimation.STOPPED) {
            let randomCell = grid.randomCell();
            // let randomCell = grid.at(10, 10);
            if (randomCell === null)
                return;
            let cellneighbors = randomCell.neighbors();
            for (let cell of cellneighbors) {
                randomCell.link(cell);
            }
            randomCell.setState(CellStates.visited);
            randomCell = grid.randomCell();
            if (randomCell === null)
                return;
            cellneighbors = randomCell.neighbors();
            for (let cell of cellneighbors) {
                randomCell.unlink(cell);
            }
            randomCell.setState(CellStates.unvisited);
            //   let cell = grid.at(0, 0);
            //   if (cell === null) return;
            //   cell.setOutwardAnimation();
            //   cell.setState(cell.state === CellStates.visited? CellStates.unvisited : CellStates.visited);
            //   counter++;
            // }
            // if (counter === 1 && grid.at(0, 0)?.animation === CellAnimation.STOPPED) 
            // {
            //   // counter = 0;
        }
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    grid.draw(ctx);
    if (deltaTime.oneDebugStepIsDone()) {
        grid.updateDebuger(ctx);
    }
}
// requestAnimationFrame(animation);
