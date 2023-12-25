import { Cell, CellAnimation, Directions } from "./cell.js";
import { Debuger } from "./debugger.js";
import { debugModeOn, mouse, mouseCellPosIsLocked } from "./input.js";
import { wallState } from "./wall.js";


export const CELLSIZE = 50;


export class Grid {
  #startX: number;
  #startY: number;
  #length: number;
  #width: number;
  #offsetLeft: number;
  #offsetTop: number;

  #mousexInGrid: number = 0;
  #mouseyInGrid: number = 0;
  #mouseCellx: number = 0;
  #mouseCelly: number = 0;

  #initialWallState: wallState = wallState.PRESENT;

  grid: Cell[][] = [];

  debuger: Debuger = new Debuger();

  //SECTION - initialization methods
  constructor(canvasLength: number, canvasWidth: number, initialWallState: wallState = wallState.PRESENT) {
    this.#length = Math.floor(canvasLength / CELLSIZE);
    this.#width = Math.floor(canvasWidth / CELLSIZE);
    this.#initialWallState = initialWallState;

    this.#prepareGrid();
    this.#initialize(canvasLength, canvasWidth, initialWallState);
  }

  #prepareGrid() {
    for (let y = 0; y < this.#width; y++) {
      this.grid[y] = [];
      for (let x = 0; x < this.#length; x++) {
        this.grid[y][x] = new Cell();
      }
    }
  }

  #initialize(canvasLength: number, canvasWidth: number, wallState: wallState) {

    this.#startX = Math.floor((canvasLength - (this.#length * CELLSIZE)) / 2);
    this.#startY = Math.floor((canvasWidth - (this.#width * CELLSIZE)) * 0.9);

    this.#offsetLeft = this.#startX;
    this.#offsetTop = this.#startY;

    for (let y = 0; y < this.#width; y++) {
      for (let x = 0; x < this.#length; x++) {
        let cellx = this.#startX + x * CELLSIZE;
        let celly = this.#startY + y * CELLSIZE;

        this.grid[y][x].init(x, y, cellx, celly, CELLSIZE, wallState);
      }
    }
    this.#configureCells();
  }

  #configureCells() {
    for (let cell of this.eachCell()) {
      let x = cell.gridx;
      let y = cell.gridy;

      cell.north = this.at(x, y - 1);
      cell.south = this.at(x, y + 1);
      cell.east = this.at(x + 1, y);
      cell.west = this.at(x - 1, y);

      if (cell.north === null) {
        cell.walls[Directions.NORTH].setWallState(wallState.PRESENT);
      }
      if (cell.south === null) {
        cell.walls[Directions.SOUTH].setWallState(wallState.PRESENT);
      }
      if (cell.east === null) {
        cell.walls[Directions.EAST].setWallState(wallState.PRESENT);
      }
      if (cell.west === null) {
        cell.walls[Directions.WEST].setWallState(wallState.PRESENT);
      }
    }
  }
  //!SECTION

  //SECTION - uncategorized methods
  public *eachCell() {
    for (let row of this.eachRow()) {
      for (let cell of row) {
        yield cell;
      }
    }
  }

  public *eachRow() {
    for (let y = 0; y < this.#width; y++) {
      yield this.grid[y];
    }
  }

  public at(x: number, y: number) {
    if (x < 0 || x >= this.#length) return null;
    if (y < 0 || y >= this.#width) return null;

    return this.grid[y][x];
  }

  public size() {
    return (this.#length * this.#width);
  }

  public randomCell() {
    let x = Math.floor(Math.random() * this.#length);
    let y = Math.floor(Math.random() * this.#width);

    return this.at(x, y);
  }
  //!SECTION

  //SECTION - animation methods

  public update(ctx: CanvasRenderingContext2D) {

    for (let cell of this.eachCell()) {
      cell.update();
    }
  }

  public writeMousePosition(ctx: CanvasRenderingContext2D) {
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "15px Arial";
    ctx.fillStyle = "black";


    ctx.fillText("x: " + this.#mouseCellx + " y: " + this.#mouseCelly, 200, this.#offsetTop - 10);
  }

  public draw(ctx: CanvasRenderingContext2D) {
    for (let cell of this.eachCell()) {
      if (cell.getAnimation() === CellAnimation.STOPPED)
        cell.draw(ctx);
    }

    for (let cell of this.eachCell()) {
      if (cell.getAnimation() !== CellAnimation.STOPPED)
        cell.draw(ctx);
    }
  }



  public updateDebuger(ctx: CanvasRenderingContext2D) {
    if (!debugModeOn) return;

    this.#mousexInGrid = mouse.x - this.#offsetLeft;
    this.#mouseyInGrid = mouse.y - this.#offsetTop;


    this.#mouseCellx = Math.floor(this.#mousexInGrid / CELLSIZE);
    this.#mouseCelly = Math.floor(this.#mouseyInGrid / CELLSIZE);

    this.debuger.update();

    this.drawDebuger(ctx);
  }

  public drawDebuger(ctx: CanvasRenderingContext2D) {
    if (!debugModeOn) return;
    this.writeMousePosition(ctx);
    this.debuger.draw(ctx, this.at(this.#mouseCellx, this.#mouseCelly));
  }

  //write the current mouss position on the arria at the top of the canvas between 0 ana #offsetTop
  //!SECTION
}