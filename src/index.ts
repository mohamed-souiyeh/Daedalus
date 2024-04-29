import { Grid } from "./grid.ts";
import { DeltaTime } from "./deltaTime.ts";
import { wallState } from "./configs/wall.config.ts";
import { CellAnimation, CellStates } from "./configs/cell.config.ts";
import { inputDefaults } from "./configs/defaults.ts";
import { globals } from "./configs/globals.ts";

let deltaTime: DeltaTime;
let grid: Grid;
let counter: number;


export function reset() {
  const canvas = globals.canvas;
  const ctx = globals.ctx;

  if (canvas === null || ctx === null) {
    console.log("canvas or ctx is null");
    return;
  }

  cancelAnimationFrame(globals.currentAnimation);
  globals.currentAnimation = 0;

  globals.startAlgo = false;

  grid.initialize(canvas.width, canvas.height, inputDefaults.DEFAULTWALLSTATE as unknown as wallState);


  deltaTime.reset();
  counter = 0;

  globals.currentAnimation = requestAnimationFrame(animation);
}

export function setup() {
  const canvas = globals.canvas;
  const ctx = globals.ctx;

  if (canvas === null || ctx === null) {
    console.log("canvas or ctx is null");
    return;
  }

  // console.log("canvas => ", canvas);
  // console.log("canvas offset width => ", canvas.offsetWidth);
  // console.log("canvas offset height => ", canvas.offsetHeight);
  // console.log("canvas width => ", canvas.width);
  // console.log("canvas height => ", canvas.height);

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  grid = new Grid(canvas.width, canvas.height, wallState.PRESENT);

  counter = 0;
  deltaTime = new DeltaTime();

  globals.setup = true;
  globals.currentAnimation = requestAnimationFrame(animation);
}

export function animation(dt: number) {
  globals.currentAnimation = requestAnimationFrame(animation);

  const canvas = globals.canvas;
  const ctx = globals.ctx;
  let startTime;
  let elapsedTime;

  if (canvas === null || ctx === null) {
    console.log("canvas or ctx is null");
    return;
  }

  if (deltaTime.lastTime === 0) {
    deltaTime.lastTime = dt;
  }

  deltaTime.update(dt);

  if (deltaTime.oneStepIsDone()) {
    startTime = performance.now();
    grid.update(ctx);
    elapsedTime = performance.now() - startTime;
    // console.debug("grid.update time => ", elapsedTime);


    startTime = performance.now();
    if (counter === 0 && grid.at(10, 10)?.animation === CellAnimation.STOPPED) {
      let randomCell = grid.randomCell();
      // let randomCell = grid.at(10, 10);

      if (randomCell === null) return;

      let cellneighbors = randomCell.neighbors();


      for (let cell of cellneighbors) {
        if (randomCell.state === CellStates.unvisited)
          randomCell.link(cell);
        else
          randomCell.unlink(cell);
      }

      randomCell.setState(randomCell.state === CellStates.visited ? CellStates.unvisited : CellStates.visited);

      randomCell = grid.randomCell();

      if (randomCell === null) return;

      cellneighbors = randomCell.neighbors();

      if (randomCell.state === CellStates.visited) {
        for (let cell of cellneighbors) {
          randomCell.unlink(cell);
        }

        randomCell.setState(CellStates.unvisited);
      }
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

    if (counter % 5 === 0 && globals.startAlgo) {
      grid.launchAlgo();
    }
    elapsedTime = performance.now() - startTime;
    // console.debug("if after grid.update time => ", elapsedTime);
  }

  startTime = performance.now();
  // ctx.fillStyle = "gold";
  // ctx.fillRect(0, 0, canvas.width, canvas.height);
  // ctx.fillStyle = "rgb(33, 40, 49)"
  // ctx.fillRect(0, 0, canvas.width, canvas.height);
  grid.draw(ctx);
  elapsedTime = performance.now() - startTime;
  // console.debug("grid.draw time => ", elapsedTime);

  if (deltaTime.oneDebugStepIsDone()) {
    grid.updateDebuger(globals.ctx as CanvasRenderingContext2D);
    grid.drawDebuger(globals.ctx as CanvasRenderingContext2D);
  }
}
