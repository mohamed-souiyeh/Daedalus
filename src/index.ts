import { Grid } from "./grid.ts";
import { DeltaTime } from "./deltaTime.ts";
import { wallState } from "./configs/wall.config.ts";
import { CELLSIZE, CellAnimation, CellStates } from "./configs/cell.config.ts";
import { inputDefaults } from "./configs/defaults.ts";
import { globals } from "./configs/globals.ts";
import svgPath from "svgpath";

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
  globals.mazeSolvingAlgorithm = null;
  globals.mazeBuildingAlgorithm = null;

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

  globals.start = {
    x: 0,
    y: 0,
    oldx: globals.start.x,
    oldy: globals.start.y,
  }

  globals.finish = {
    x: grid.length - 1,
    y: grid.width - 1,
    oldx: globals.finish.x,
    oldy: globals.finish.y,
  }


  globals.gridOffsetLeft = Math.floor((canvas.width - (grid.length * CELLSIZE)) / 2);
  globals.gridOffsetTop = Math.floor((canvas.height - (grid.width * CELLSIZE)) * 0.5);

  globals.homePath = new svgPath("M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z");
  globals.homePath.scale(0.038).round(1).rel();

  globals.finishPath = new svgPath("M32 0C49.7 0 64 14.3 64 32V48l69-17.2c38.1-9.5 78.3-5.1 113.5 12.5c46.3 23.2 100.8 23.2 147.1 0l9.6-4.8C423.8 28.1 448 43.1 448 66.1V345.8c0 13.3-8.3 25.3-20.8 30l-34.7 13c-46.2 17.3-97.6 14.6-141.7-7.4c-37.9-19-81.3-23.7-122.5-13.4L64 384v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V400 334 64 32C0 14.3 14.3 0 32 0zM64 187.1l64-13.9v65.5L64 252.6V318l48.8-12.2c5.1-1.3 10.1-2.4 15.2-3.3V238.7l38.9-8.4c8.3-1.8 16.7-2.5 25.1-2.1l0-64c13.6 .4 27.2 2.6 40.4 6.4l23.6 6.9v66.7l-41.7-12.3c-7.3-2.1-14.8-3.4-22.3-3.8v71.4c21.8 1.9 43.3 6.7 64 14.4V244.2l22.7 6.7c13.5 4 27.3 6.4 41.3 7.4V194c-7.8-.8-15.6-2.3-23.2-4.5l-40.8-12v-62c-13-3.8-25.8-8.8-38.2-15c-8.2-4.1-16.9-7-25.8-8.8v72.4c-13-.4-26 .8-38.7 3.6L128 173.2V98L64 114v73.1zM320 335.7c16.8 1.5 33.9-.7 50-6.8l14-5.2V251.9l-7.9 1.8c-18.4 4.3-37.3 5.7-56.1 4.5v77.4zm64-149.4V115.4c-20.9 6.1-42.4 9.1-64 9.1V194c13.9 1.4 28 .5 41.7-2.6l22.3-5.2z");
  globals.finishPath.scale(0.040).round(1).rel();

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

    if (counter % inputDefaults.ALGOSPEED === 0 && globals.startAlgo) {
      grid.launchAlgo();
    }
    counter++;
    elapsedTime = performance.now() - startTime;
    // console.debug("if after grid.update time => ", elapsedTime);
  }

  startTime = performance.now();
  // ctx.fillStyle = "gold";
  // ctx.fillRect(0, 0, canvas.width, canvas.height);
  // ctx.fillStyle = "rgb(33, 40, 49)"
  // if (true) {
  //   ctx.clearRect(0, 0, canvas.width, canvas.height);
  //   let newPath = new svgPath("M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z");
  //   newPath.scale(0.04).round(1).translate(200, 200);
  //   console.log(newPath.toString());
  //   let p = new Path2D(newPath.toString());
  //   ctx.fillStyle = "gold";
  //   ctx.fill(p);
  // }
  grid.draw(ctx);
  elapsedTime = performance.now() - startTime;
  // console.debug("grid.draw time => ", elapsedTime);

  if (deltaTime.oneDebugStepIsDone()) {
    grid.updateDebuger(globals.ctx as CanvasRenderingContext2D);
    grid.drawDebuger(globals.ctx as CanvasRenderingContext2D);
  }
}
