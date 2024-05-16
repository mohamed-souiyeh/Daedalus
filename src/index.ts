import { Grid } from "./grid.ts";
import { DeltaTime } from "./deltaTime.ts";
import { WallState } from "./configs/wall.config.ts";
import { CELLSIZE, CellAnimation, CellStates } from "./configs/cell.config.ts";
import { inputDefaults } from "./configs/defaults.ts";
import { globals } from "./configs/globals.ts";
import svgPath from "svgpath";
import { PriorityQueue } from "./types/DataStructures/priorityQueue.types.ts";

let deltaTime: DeltaTime;
let counter: number;


export function reset() {
  if (globals.reset) return;
  const canvas = globals.canvas;
  const ctx = globals.ctx;

  if (canvas === null || ctx === null) {
    console.log("canvas or ctx is null");
    return;
  }

  cancelAnimationFrame(globals.currentAnimation);
  globals.currentAnimation = 0;

  globals.startAlgo = false;
  globals.animatePath = false;
  globals.mazeSolvingAlgorithm = null;
  globals.mazeBuildingAlgorithm = null;

  globals.depthFilterPos = {
    x: Math.floor(Math.random() * globals.grid.length),
    y: Math.floor(Math.random() * globals.grid.width),
    oldx: Math.floor(Math.random() * globals.grid.length),
    oldy: Math.floor(Math.random() * globals.grid.width),
  }

  globals.grid.initialize(canvas.width, canvas.height, globals.WallsOn);
  globals.reset = true;
  globals.needclear = false;

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

  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;


  globals.grid = new Grid(canvas.width, canvas.height, globals.WallsOn);

  let _lengthPos: number = 0.25;
  let _widthPos: number = 0.5;

  if (globals.grid.length < globals.grid.width) {
    _lengthPos = 0.5;
    _widthPos = 0.25;
  }

  globals.start = {
    x: Math.floor(globals.grid.length * _lengthPos),
    y: Math.floor(globals.grid.width * _widthPos),
    oldx: globals.start.x,
    oldy: globals.start.y,
  }

  globals.finish = {
    x: Math.floor(globals.grid.length * (1 - _lengthPos)),
    y: Math.floor(globals.grid.width * (1 - _widthPos)),
    oldx: globals.finish.x,
    oldy: globals.finish.y,
  }

  console.log(_lengthPos, _widthPos);
  console.log(globals.start, globals.finish);
  globals.depthFilterPos = {
    x: Math.floor(Math.random() * globals.grid.length),
    y: Math.floor(Math.random() * globals.grid.width),
    oldx: Math.floor(Math.random() * globals.grid.length),
    oldy: Math.floor(Math.random() * globals.grid.width),
  }

  globals.grid.initialize(canvas.width, canvas.height, globals.WallsOn);
  globals.reset = true;
  globals.animatePath = false;
  globals.startAlgo = false;
  globals.needclear = false;
  globals.updateDepthFilter = false;

  globals.gridOffsetLeft = Math.floor((canvas.width - (globals.grid.length * CELLSIZE)) / 2);
  globals.gridOffsetTop = Math.floor((canvas.height - (globals.grid.width * CELLSIZE)) * 0.5);

  globals.homePath = new svgPath("M575.8 255.5c0 18-15 32.1-32 32.1h-32l.7 160.2c0 2.7-.2 5.4-.5 8.1V472c0 22.1-17.9 40-40 40H456c-1.1 0-2.2 0-3.3-.1c-1.4 .1-2.8 .1-4.2 .1H416 392c-22.1 0-40-17.9-40-40V448 384c0-17.7-14.3-32-32-32H256c-17.7 0-32 14.3-32 32v64 24c0 22.1-17.9 40-40 40H160 128.1c-1.5 0-3-.1-4.5-.2c-1.2 .1-2.4 .2-3.6 .2H104c-22.1 0-40-17.9-40-40V360c0-.9 0-1.9 .1-2.8V287.6H32c-18 0-32-14-32-32.1c0-9 3-17 10-24L266.4 8c7-7 15-8 22-8s15 2 21 7L564.8 231.5c8 7 12 15 11 24z");
  globals.homePath.scale(0.038).round(1).rel();

  globals.finishPath = new svgPath("M32 0C49.7 0 64 14.3 64 32V48l69-17.2c38.1-9.5 78.3-5.1 113.5 12.5c46.3 23.2 100.8 23.2 147.1 0l9.6-4.8C423.8 28.1 448 43.1 448 66.1V345.8c0 13.3-8.3 25.3-20.8 30l-34.7 13c-46.2 17.3-97.6 14.6-141.7-7.4c-37.9-19-81.3-23.7-122.5-13.4L64 384v96c0 17.7-14.3 32-32 32s-32-14.3-32-32V400 334 64 32C0 14.3 14.3 0 32 0zM64 187.1l64-13.9v65.5L64 252.6V318l48.8-12.2c5.1-1.3 10.1-2.4 15.2-3.3V238.7l38.9-8.4c8.3-1.8 16.7-2.5 25.1-2.1l0-64c13.6 .4 27.2 2.6 40.4 6.4l23.6 6.9v66.7l-41.7-12.3c-7.3-2.1-14.8-3.4-22.3-3.8v71.4c21.8 1.9 43.3 6.7 64 14.4V244.2l22.7 6.7c13.5 4 27.3 6.4 41.3 7.4V194c-7.8-.8-15.6-2.3-23.2-4.5l-40.8-12v-62c-13-3.8-25.8-8.8-38.2-15c-8.2-4.1-16.9-7-25.8-8.8v72.4c-13-.4-26 .8-38.7 3.6L128 173.2V98L64 114v73.1zM320 335.7c16.8 1.5 33.9-.7 50-6.8l14-5.2V251.9l-7.9 1.8c-18.4 4.3-37.3 5.7-56.1 4.5v77.4zm64-149.4V115.4c-20.9 6.1-42.4 9.1-64 9.1V194c13.9 1.4 28 .5 41.7-2.6l22.3-5.2z");
  globals.finishPath.scale(0.040).round(1).rel();

  globals.depthFilterPath = new svgPath("M320 64A64 64 0 1 0 192 64a64 64 0 1 0 128 0zm-96 96c-35.3 0-64 28.7-64 64v48c0 17.7 14.3 32 32 32h1.8l11.1 99.5c1.8 16.2 15.5 28.5 31.8 28.5h38.7c16.3 0 30-12.3 31.8-28.5L318.2 304H320c17.7 0 32-14.3 32-32V224c0-35.3-28.7-64-64-64H224zM132.3 394.2c13-2.4 21.7-14.9 19.3-27.9s-14.9-21.7-27.9-19.3c-32.4 5.9-60.9 14.2-82 24.8c-10.5 5.3-20.3 11.7-27.8 19.6C6.4 399.5 0 410.5 0 424c0 21.4 15.5 36.1 29.1 45c14.7 9.6 34.3 17.3 56.4 23.4C130.2 504.7 190.4 512 256 512s125.8-7.3 170.4-19.6c22.1-6.1 41.8-13.8 56.4-23.4c13.7-8.9 29.1-23.6 29.1-45c0-13.5-6.4-24.5-14-32.6c-7.5-7.9-17.3-14.3-27.8-19.6c-21-10.6-49.5-18.9-82-24.8c-13-2.4-25.5 6.3-27.9 19.3s6.3 25.5 19.3 27.9c30.2 5.5 53.7 12.8 69 20.5c3.2 1.6 5.8 3.1 7.9 4.5c3.6 2.4 3.6 7.2 0 9.6c-8.8 5.7-23.1 11.8-43 17.3C374.3 457 318.5 464 256 464s-118.3-7-157.7-17.9c-19.9-5.5-34.2-11.6-43-17.3c-3.6-2.4-3.6-7.2 0-9.6c2.1-1.4 4.8-2.9 7.9-4.5c15.3-7.7 38.8-14.9 69-20.5z")
  globals.depthFilterPath.scale(0.040).round(1).rel();

  globals.weightedNodePath = new svgPath("M224 96a32 32 0 1 1 64 0 32 32 0 1 1 -64 0zm122.5 32c3.5-10 5.5-20.8 5.5-32c0-53-43-96-96-96s-96 43-96 96c0 11.2 1.9 22 5.5 32H120c-22 0-41.2 15-46.6 36.4l-72 288c-3.6 14.3-.4 29.5 8.7 41.2S33.2 512 48 512H464c14.8 0 28.7-6.8 37.8-18.5s12.3-26.8 8.7-41.2l-72-288C433.2 143 414 128 392 128H346.5z");
  globals.weightedNodePath.scale(0.038).round(1).rel();

  counter = 0;
  deltaTime = new DeltaTime();

  globals.setup = true;
  globals.currentAnimation = requestAnimationFrame(animation);

  // interface test {
  //   i: number,
  //   index: number,
  // }
  // let array: test[] = [{ i: 6, index: 0 }, { i: 5, index: 0 }, { i: 4, index: 0 }, { i: 3, index: 0 }, { i: 2, index: 0 }, { i: 1, index: 0 },];
  // const queue: PriorityQueue<test> = new PriorityQueue<test>((lhs: test, rhs: test) => lhs.i < rhs.i);
  //
  // queue.enqueue(array[5]);
  // queue.print();
  // queue.enqueue(array[4]);
  // queue.print();
  // queue.enqueue(array[3]);
  // queue.print();
  // queue.enqueue(array[2]);
  // queue.print();
  // queue.enqueue(array[1]);
  // queue.print();
  // queue.enqueue(array[0]);
  // queue.print();
  // queue.updatePriority(array[2], (item: test) => item.i = 0);
  // queue.print();
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
    globals.grid.update(ctx);
    elapsedTime = performance.now() - startTime;
    // console.debug("grid.update time => ", elapsedTime);


    startTime = performance.now();

    if (globals.updateDepthFilter && globals.reset === false) {
      console.log("depth filter updated");
      globals.grid.depthFilter();
      globals.updateDepthFilter = false;
    }
    if ((counter % inputDefaults.ALGOSPEED === 0 || globals.hotReload) && globals.reset === false) {
      if (globals.startAlgo)
        globals.grid.launchAlgo();
      if (globals.animatePath)
        globals.grid.animatePath();
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
  globals.grid.draw(ctx);
  elapsedTime = performance.now() - startTime;
  // console.debug("grid.draw time => ", elapsedTime);

  if (deltaTime.oneDebugStepIsDone()) {
    globals.grid.updateDebuger(globals.ctx as CanvasRenderingContext2D);
    globals.grid.drawDebuger(globals.ctx as CanvasRenderingContext2D);
  }
}
