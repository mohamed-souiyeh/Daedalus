import { resetShadowStyle, setShadowStyle } from "./canvas_ctx_style_manipulation/shadows.ts";
import { Cell } from "./cell.ts";
import { CELLSIZE, CellAnimation, Directions } from "./configs/cell.config.ts";
import { globals } from "./configs/globals.ts";
import { mouse } from "./configs/input.config.ts";
import { wallState } from "./configs/wall.config.ts";
import { Debuger } from "./debugger.ts";



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

  //SECTION - getters and setters

  get startX() {
    return this.#startX;
  }

  get startY() {
    return this.#startY;
  }

  get length() {
    return this.#length;
  }

  get width() {
    return this.#width;
  }

  get offsetLeft() {
    return this.#offsetLeft;
  }

  get offsetTop() {
    return this.#offsetTop;
  }
  //!SECTION 



  //SECTION - initialization methods
  constructor(canvasLength: number, canvasWidth: number, initialWallState: wallState = wallState.PRESENT) {
    //FIXME - this is just for testing
    this.#length = Math.floor(canvasLength / CELLSIZE);
    this.#width = Math.floor(canvasWidth / CELLSIZE);
    // this.#length = 1;
    // this.#width = 1;
    this.#initialWallState = initialWallState;

    this.#prepareGrid();
    this.initialize(canvasLength, canvasWidth, initialWallState);
  }

  #prepareGrid() {
    for (let y = 0; y < this.#width; y++) {
      this.grid[y] = [];
      for (let x = 0; x < this.#length; x++) {
        this.grid[y][x] = new Cell();
      }
    }
  }

  public initialize(canvasLength: number, canvasWidth: number, wallState: wallState) {

    this.#startX = Math.floor((canvasLength - (this.#length * CELLSIZE)) / 2);
    this.#startY = Math.floor((canvasWidth - (this.#width * CELLSIZE)) * 0.5);

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

    ctx.clearRect(this.startX, this.startY, this.#length * CELLSIZE, this.#width * CELLSIZE);

    for (let cell of this.eachCell()) {
      if (cell.animation === CellAnimation.STOPPED) {
        if (cell.gridx !== this.#mouseCellx || cell.gridy !== this.#mouseCelly || !globals.debugModeOn)
          cell.draw(ctx);
      }
    }


    setShadowStyle(ctx, { blur: 10, color: "green" })
    for (let cell of this.eachCell()) {
      if (cell.animation !== CellAnimation.STOPPED) {
        (cell.gridx !== this.#mouseCellx || cell.gridy !== this.#mouseCelly)
        cell.draw(ctx);
      }
    }
    resetShadowStyle(ctx);

    if (globals.debugModeOn) {
      setShadowStyle(ctx, { blur: 10, color: "red" })
      this.at(this.#mouseCellx, this.#mouseCelly)?.draw(ctx);
      resetShadowStyle(ctx);
    }
  }



  public updateDebuger(ctx: CanvasRenderingContext2D) {
    if (!globals.debugModeOn) return;

    this.#mousexInGrid = mouse.x - this.#offsetLeft;
    this.#mouseyInGrid = mouse.y - this.#offsetTop;


    this.#mouseCellx = Math.floor(this.#mousexInGrid / CELLSIZE);
    this.#mouseCelly = Math.floor(this.#mouseyInGrid / CELLSIZE);

    this.debuger.update();

  }

  public drawDebuger(ctx: CanvasRenderingContext2D) {

    if (!globals.debugModeOn) return;
    // this.writeMousePosition(ctx);
    this.debuger.draw(ctx, this.at(this.#mouseCellx, this.#mouseCelly), this);
  }

  //write the current mouss position on the arria at the top of the canvas between 0 ana #offsetTop
  //!SECTION
}